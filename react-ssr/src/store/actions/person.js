export const FETCH_PERSON_DATA = "fetch_person_data";

export const fetchPersonData = async (dispath) => {
  const data = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        userInfo: {
          username: "Chin",
          job: "Full Stack",
        }
      });
    }, 2000);
  });

  dispath({
    type: FETCH_PERSON_DATA,
    payload: data,
  });
};
