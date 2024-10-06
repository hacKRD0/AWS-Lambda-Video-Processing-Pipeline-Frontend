import { useAuth, useUser } from '@clerk/nextjs';
import { get } from 'http';
import React, { useEffect, useState } from 'react';
interface ResultItem {
  key: string;
  file_url: string;
  faceresult: string;
}

export const Results = () => {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [fetching, setFetching] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );

  const { user } = useUser();
  const { userId } = useAuth();
  // console.log(user);
  // console.log(userId);
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  // console.log(userEmail);

  const deleteRecords = async (payload: {
    bucketname: string;
    key: string;
  }) => {
    try {
      const response = await fetch('/api/lambda/deleteS3Result', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          'Access-Control-Allow-Credentials': 'true', // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error('Error deleting the Records');
      }

      console.log('Delete response ---->', response);
      setNotificationMessage('Successfully Deleted !!!');
      setShowMessage(true);
    } catch (error) {
      setNotificationMessage(null);
      setShowMessage(true);
      console.error('Error deleting the records', error);
    }
  };

  const handleDelete = async (index: number) => {
    console.log('Delete ------>');
    console.log('index ------->', index);
    let key = results[index].key;
    console.log('Key ---->', key);

    let updatedResults = results.filter((_, idx) => idx !== index);
    setResults(updatedResults);

    const payload = {
      bucketname: process.env.NEXT_PUBLIC_AWS_S3_OUTPUT_BUCKET_NAME || '',
      key: key,
    };

    deleteRecords(payload);
  };

  const handleFetchValue = async () => {
    setFetching(true);
    try {
      if (!userId) return;

      const payload = {
        bucketname: process.env.NEXT_PUBLIC_AWS_S3_OUTPUT_BUCKET_NAME || '',
        clerkuid: userId,
      };

      console.log('Payload ----> ', payload);

      const getS3ResultsUrl = '/api/lambda/getS3Results';
      console.log('JSON Payload ----> ', getS3ResultsUrl);

      const response = await fetch(getS3ResultsUrl, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          // 'Access-Control-Allow-Origin': '*', // Required for CORS support to work
          // 'Access-Control-Allow-Credentials': 'true', // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error(`Error fetching the data, ${response.status}`);
      }

      const responseObj = await response.json();
      console.log('ResponseObj ----->', responseObj);

      if (Array.isArray(responseObj)) {
        setResults(responseObj);
      } else {
        console.error('Expected an array, but got:', responseObj);
        setResults([]); // Reset results to an empty array if not an array
      }
    } catch (error) {
      console.error('Error fetching the data: ', error);
      setResults([]); // Reset results to an empty array on error
    } finally {
      setFetching(false);
    }
  };

  const handleRefresh = async () => {
    await handleFetchValue();
  };

  const handleClose = () => {
    setShowMessage(false);
    setNotificationMessage(null);
  };

  useEffect(() => {
    handleRefresh();
  }, [user]);

  return (
    <div className="min-h-full mt-10">
      <div className="flex-box justify-center items-center mt-6 md:mt-2 rounded-lm">
        {showMessage && (
          <div className="flex justify-center p-2 mb-8 md:mb-[-5px] mt-[-8px] mx-[24px] sm:mx-[42px] md:mt-4 md:mx-auto md:w-full md:max-w-2xl bg-indigo-100 text-indigo-700 border-2 border-indigo-300/50 hover:bg-indigo-150 rounded-2xl">
            <p className="text-center font-semibold flex-grow">
              {notificationMessage}
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              onClick={handleClose}
              className="size-5 mt-auto hover:text-violet-900 hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
        {/* <div className="w-full rounded-lm p-6 ">
            <UploadMedia 
            user={user} 
            setShowMessage={setShowMessage}
            setNotificationMessage={setNotificationMessage}
            />
          </div> */}
        <div className="relative bg-gray-900 mt-8 md:mt-auto mx-6 sm:mx-auto md:mx-auto p-6 py-auto rounded-2xl shadow-2xl border-2 hover:border-indigo-300 max-w-2xl">
          <div className="flex font-medium text-2xl space-x-2 items-center ">
            <h2>Results</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              onClick={handleRefresh}
              className={`mt-1 size-6 text-gray-100 hover:scale-110 hover:text-gray-500 ${
                fetching ? 'animate-spin' : ''
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </div>
          <table className="mt-4 table-auto w-full divide-y divide-gray-500">
            <thead>
              <tr className="bg-gray-800 divide-y h-10">
                <th className="font-normal w-1/3">Request</th>
                <th className="font-normal w-1/3">Result</th>
                <th className="font-normal w-1/3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {results &&
                results.map((item, index) => (
                  <tr className="justify-items-center min-h-[5rem]" key={index}>
                    <th className="flex items-center justify-center py-2">
                      <img
                        className="h-15 sm:h-15 md:h-20 rounded-xl"
                        src={item.file_url}
                        alt={item.faceresult}
                      />
                    </th>
                    <th className="items-center text-slate-500 font-semibold">
                      {item.faceresult}
                    </th>
                    <th className="flex justify-center items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        onClick={() => {
                          handleDelete(index);
                        }}
                        className="size-5 md:size-6 h-14 md:h-20 text-gray-400 hover:text-blue-900 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </th>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
