import Class from 'pages/classes/Class';
import InvalidCredentials from '../errors/InvalidCredentials';
import { getAccessToken } from '../login/authService';
import { JoinRequest } from './JoinRequest';
import { request } from '../utils/Service';

const classesEndpoint = '/api/v1/class';

export type DirtyJoinRequest = {
  class_id: number;
  user_id: number;
};

const getApiUrl = () => {
  return process.env['NEXT_PUBLIC_API_URL'];
};

const getJsonHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

const getClassesUrl = (): string => {
  return getApiUrl() + classesEndpoint;
};

const getAllClasses = async (): Promise<Response> => {
  const getClassesEndpoint = getClassesUrl();
  const getClassesHeader = getJsonHeaders();

  return await fetch(getClassesEndpoint, {
    method: 'GET',
    headers: getClassesHeader,
  });
};

const getClassEndpoint = (id: number): string => {
  return getApiUrl() + classesEndpoint + `/${id}`;
};

const getClass = async ({ id }: { id: number }): Promise<Response> => {
  const endpoint = getClassEndpoint(id);
  const getClassHeader = getJsonHeaders();

  return await fetch(endpoint, {
    method: 'GET',
    headers: getClassHeader,
  });
};

const getAuthHeaders = (): HeadersInit => {
  const token = getAccessToken();

  if (!token) {
    throw new InvalidCredentials(
      'You should be signed in to access user classes.'
    );
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

const fetchUserClasses = async ({
  userId,
}: {
  userId: number;
}): Promise<Response> => {
  const endpointUrl = `${getApiUrl()}/api/v1/classes/${userId}`;
  const headers = getAuthHeaders();

  return await fetch(endpointUrl, {
    method: 'GET',
    headers: headers,
  });
};

const postRequest = async ({
  classId,
}: {
  classId: number;
}): Promise<Response> => {
  const endpointUrl = `${getApiUrl()}/api/v1/student/request/${classId}`;
  const headers = getAuthHeaders();

  return await fetch(endpointUrl, {
    method: 'POST',
    headers: headers,
  });
};

const fetchUserJoinRequests = async (): Promise<Response> => {
  const endpointUrl = `${getApiUrl()}/api/v1/student/requests`;
  const headers = getAuthHeaders();

  return await fetch(endpointUrl, {
    method: 'GET',
    headers,
  });
};

const fetchJoinRequsts = async ({classId}: {classId: number}) => {
  const endpointUrl = `${getApiUrl()}/api/v1/class/requests/${classId}`;
  const headers = getAuthHeaders();

  return await fetch(endpointUrl, {
    method: 'GET',
    headers
  });
}

const deleteClass = async ({classId}: {classId: number}) => {
  const endpointUrl = `${getApiUrl()}/api/v1/class/${classId}`;
  const headers = getAuthHeaders();

  return await fetch(
    endpointUrl,
    {
      method: 'DELETE',
      headers
    }
  )
}

export const findAllClasses = async (): Promise<Class[]> => {
  return await request({
    fetchFunction: getAllClasses,
    errors: {
      InvalidCredentials: "Couldn't get any classes. Try again later",
      Forbidden: 'You are not allowed to fetch classes',
      Error: "Couldn't get classes. Please try again later",
      JsonError: "Couldn't get json from classes response.",
    },
  });
};

export const findClass = async (id: number): Promise<Class> => {
  return await request({
    fetchFunction: getClass,
    errors: {
      InvalidCredentials: `Couldn't get a class id=${id}. Try again later`,
      Forbidden: `You are not allowed to fetch class id=${id}`,
      Error: `Couldn't get a class id=${id}. Please try again later`,
      JsonError: `Couldn't get json from a class response id=${id}.`,
    },
    args: { id },
  });
};

export const findUserClasses = async (userId: number): Promise<Class[]> => {
  return await request({
    fetchFunction: fetchUserClasses,
    errors: {
      InvalidCredentials:
        "Couldn't fetch user classes due to invalid credentials. Try again later",
      Forbidden: 'You are not allowed to fetch user classes.',
      Error: "Couldn't get user classes. Please try again later",
      JsonError: "Couldn't get JSON from user classes response.",
    },
    args: { userId },
  });
};

export const sendRequest = async (classId: number): Promise<void> => {
  return await request({
    fetchFunction: postRequest,
    errors: {
      InvalidCredentials: `Couldn't send a request to join ${classId}`,
      Forbidden: `You are not allowed to join this class`,
      Error: `Something went wrong while requesting to join class id=${classId}`,
      JsonError: `Couldn't get JSON from send request response; class id=${classId}`,
    },
    args: { classId },
  });
};

export const getUserJoinRequests = async (): Promise<JoinRequest[]> => {
  

  const requests = await request<DirtyJoinRequest[]>({
    fetchFunction: fetchUserJoinRequests,
    errors: {
      InvalidCredentials: `Couldn't fetch join requests.`,
      Forbidden: `You are not allowed to fetch join requests`,
      Error: `Something went wrong while fetching classes`,
      JsonError: `Couldn't get JSON from send requests`,
    }
  });

  return requests.map((request) => {
    return { classId: request.class_id, userId: request.user_id };
  });
};

export const getJoinRequests = async (classId): Promise<JoinRequest[]> => {
  type DirtyJoinRequest = {
    class_id: number;
    user_id: number;
  };

  const requests = await request<DirtyJoinRequest[]>({
    fetchFunction: fetchJoinRequsts,
    errors: {
      InvalidCredentials: `Couldn't fetch join requests.`,
      Forbidden: `You are not allowed to fetch join requests`,
      Error: `Something went wrong while fetching classes`,
      JsonError: `Couldn't get JSON from send requests`,
    },
    args: {classId}
  });

  return requests.map((request) => {
    return { classId: request.class_id, userId: request.user_id };
  });
}

export const removeClass = async(classId) => {
  return await request({
    fetchFunction: deleteClass,
    errors: {
      InvalidCredentials: `Couldn't delete a class id=${classId}. Try again later`,
      Forbidden: `You are not allowed to delete a class id=${classId}`,
      Error: `Couldn't delete a class id=${classId}. Please try again later`,
      JsonError: `Couldn't get json from a deleted class response id=${classId}.`,
    },
    args: { classId },
  });
}