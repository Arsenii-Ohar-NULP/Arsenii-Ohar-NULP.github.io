import React, { useState } from 'react';
import Image from 'next/image';
import sendIcon from 'icons/send.svg';
import Message from 'pages/class/Message';
import InvalidCredentials from 'pages/errors/InvalidCredentials';
import { useAppDispatch, useAppSelector } from 'pages/redux/store';
import { saveMessage } from 'pages/class/MessageService';
import { authActions } from 'pages/redux/auth';
import { useRouter } from 'next/router';
import { Button } from 'react-bootstrap';
import clsx from 'clsx';

export function MessageInput({
  forbidden,
  onSend,
  classId,
}: {
  forbidden: boolean;
  onSend: (message: Message) => void;
  classId: number;
}) {
  const [messageText, setMessage] = useState<string>(null);

  const userId = useAppSelector((state) => state.auth.user?.id);
  const username = useAppSelector((state) => state.auth.user?.username);
  const firstName = useAppSelector((state) => state.auth.user?.firstName);
  const lastName = useAppSelector((state) => state.auth.user?.lastName);

  const dispatch = useAppDispatch();
  const router = useRouter();

  function send() {
    const message = {
      content: messageText,
      user: userId,
      cls: classId,
    } as Message;
    saveMessage({ message })
      .then((data) => {
        message.username = username;
        message.fullname = `${firstName} ${lastName}`;
        message.id = data?.id;
        onSend(message);
        setMessage('');
      })
      .catch((error) => {
        if (error instanceof InvalidCredentials) {
          dispatch(authActions.logout());
          router.push('/login');
        }
      });
  }

  function isEmptyOrSpaces(str: string) {
    return str === null || str.match(/^ *$/) !== null;
  }

  return (
    <div className="fixed-bottom m-4">
      <form>
        <div className="input-group">
          <input
            className="form-control bg-dark text-light"
            placeholder="Enter any message you like"
            onChange={(e) => setMessage(e.target.value)}
            value={messageText}
            disabled={forbidden}
          ></input>
          <Button
            variant="primary"
            className={clsx({
              'visually-hidden':
                messageText == null || isEmptyOrSpaces(messageText),
            })}
            onClick={send}
          >
            <Image alt={'Send Icon'} src={sendIcon} width={24} height={24} />
          </Button>
        </div>
      </form>
    </div>
  );
}