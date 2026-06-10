import { useCallback } from "react";

const BASE_URL =
  "https://netflixgpt-d9389-default-rtdb.firebaseio.com/mails";

const useMailApi = () => {
  const getMails = useCallback(async () => {
    const response = await fetch(`${BASE_URL}.json`);
    return await response.json();
  }, []);

  const addMail = useCallback(async (mailData) => {
    await fetch(`${BASE_URL}.json`, {
      method: "POST",
      body: JSON.stringify(mailData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  const deleteMail = useCallback(async (id) => {
    await fetch(`${BASE_URL}/${id}.json`, {
      method: "DELETE",
    });
  }, []);

  const markMailAsRead = useCallback(async (id) => {
  await fetch(`${BASE_URL}/${id}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      read: true,
    }),
  });
}, []);

  return {
    getMails,
    addMail,
    deleteMail,
    markMailAsRead,
  };
};

export default useMailApi;