import React from 'react';
import { useRouter } from 'next/router';
import {
  useLoginRedirect,
} from 'pages/utils/hooks';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Class from 'pages/classes/Class';
import styles from 'pages/class/class.module.scss';
import { findClassThumbnail } from 'pages/ClassThumbnailService';
import { MessagesBar } from './MessagesBar';
import { findClass } from 'pages/ClassService';

function Loading() {
  return (
    <div className="">
      <div className="spinner-border text-primary text-center" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}


export default function ClassPage() {
  useLoginRedirect();
  const router = useRouter();
  const [cls, setClass] = useState<Class>(null);
  const [image, setImage] = useState(null);
  const [joined, setJoined] = useState<boolean>(false);

  useEffect(() => {
    if (!cls) {
      return;
    }

    findClassThumbnail(cls.id).then((data) => {
      setImage(`data:image/png; base64, ${data}`);
    });
  }, [cls, image]);

  function redirectToUnknown() {
    router.push('/404');
  }

  function noIdSpecified(): boolean {
    return !router.query['id'];
  }

  function fetchClass() {
    const id = Number.parseInt(router.query.id as string);
    findClass(id)
    .then((cls) => {
      setClass(cls);
    })
    .catch((e) => console.log(e));
  }

  useEffect(() => {
    if (noIdSpecified()) {
      return;
    }

    if (!cls) {
      try {
        fetchClass();
      } catch (e) {
        redirectToUnknown();
      }
    }
  }, [cls, router.query]);

  if (!cls)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Loading />
      </div>
    );
  return (
    <>
      <div>
        <Head>
          <title>Classes - {cls?.title ? cls.title : 'loading'}</title>
        </Head>
        <div className="container">
          <div className="container card bg-secondary text-white w-auto rounded shadow mt-sm-1 py-2">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {image ? (
                <img className={'rounded-2 ' + styles['pic']} src={image}></img>
              ) : (
                <div className="d-flex justify-content-center align-items-center">
                  <Loading />
                </div>
              )}
              <div className="d-flex flex-column align-items-center">
                <div>
                  <div className="pt-lg-3 px-3 pb-0">
                    <p className="m-0 fs-3">{cls.title} {joined && <span className="badge badge-primary align-middle text-dark bg-primary fs-6">Joined</span>}</p>
                  </div>
                  <div className="px-3">
                    <a>
                      <p className="fs-5">{`${cls['teacher_first_name']} ${cls['teacher_last_name']}`}</p>
                    </a>
                  </div>
                  <div className="px-3">
                    <p className="fs-6">{cls.description}</p>
                  </div>
                </div>
              </div>
              <div
                className={
                  'd-flex justify-content-end align-items-center mb-2 ' +
                  styles['join-button']
                }
              >
                <button className="btn btn-primary mx-3">{joined ? "Leave" : "Join"}</button>
              </div>
            </div>
          </div>
          <MessagesBar cls={cls} onForbidden={() => setJoined(false)}/>
        </div>
      </div>
    </>
  );
}
