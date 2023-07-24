import { batchGetDocs } from 'firebase/firestore';

const fetchAllPublications = async (db, setPublications) => {
  try {
    const data = await getPosts(); // Assuming getPosts is an efficient function to fetch publications

    if (data && data.length > 0) {
      // Extract unique userIDs from the publications data
      const userIds = [...new Set(data.map((publication) => publication.userID))];

      // Fetch user data using batch reads
      const userDocRefs = userIds.map((userId) => doc(db, 'profile', userId));
      const userDocs = await batchGetDocs(userDocRefs);
      const userDataMap = {};
      userDocs.forEach((userDoc) => {
        userDataMap[userDoc.id] = userDoc.data();
      });

      // Combine user data with publications
      const publicationsWithUser = data.map((publication) => ({
        ...publication,
        user: userDataMap[publication.userID],
      }));

      setPublications(publicationsWithUser);
    } else {
      setPublications([]);
    }
  } catch (error) {
    // Handle any errors here
    console.error('Error fetching publications:', error);
    setPublications([]);
  }
};
