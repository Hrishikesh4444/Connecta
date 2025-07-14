import { base_URL, clientServer } from "@/config";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction";
import {
  getAboutUser,
  getAllUsers,
  getConnectionRequest,
  getMyConnectionRequests,
  sendConnectionRequest,
} from "@/config/redux/action/authAction";

export default function ViewProfile({ userProfile }) {
  const searchParams = useSearchParams();

  const router = useRouter();

  const postState = useSelector((state) => state.postsReducer);

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    dispatch(getAboutUser({ token: sessionStorage.getItem("token") }));

    await dispatch(getAllPosts());

    await dispatch(
      getConnectionRequest({ token: sessionStorage.getItem("token") })
    );
    await dispatch(getAllUsers());
    await dispatch(
      getMyConnectionRequests({ token: sessionStorage.getItem("token") })
    );

    console.log(authState.connections);
  };

  useEffect(() => {
    getUserPost();
  }, []);

  useEffect(() => {
    let post = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });

    setUserPosts(post);
  }, [postState.posts]);

  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user?.userId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connections.find(
          (user) =>
            user.userId._id === userProfile.userId._id &&
            user.status_accepted === true
        )
      ) {
        setIsConnectionNull(false);
      }
    }

    if (
      authState.connectionRequest.some(
        (user) => user.connectionId._id === userProfile.userId._id
      )
    ) {
      setIsCurrentUserInConnection(true);

      if (
        authState.connectionRequest.find(
          (user) =>
            user.connectionId._id === userProfile.userId._id &&
            user.status_accepted === true
        )
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, authState.connectionRequest]);

  return (
    <div>
      <UserLayout>
        <DashboardLayout>
          <div className={styles.userProfileContainer}>
            <div className={styles.backDropContainer}>
              <img
                className={styles.backDrop}
                src={`${base_URL}/${userProfile.userId.profilePicture}`}
                alt=""
              />
            </div>

            <div className={styles.profileConatiner_details}>
              <div className={styles.profileContainer_details_div}>
                <div style={{ flex: "0.7" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      gap: "1.2rem",
                      alignItems: "center",
                    }}
                  >
                    <h2>{userProfile.userId.name}</h2>
                    <p>@{userProfile.userId.username}</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    {authState.profileFetched && userProfile.userId._id.toString() !== authState.user?.userId._id.toString() && (
                      <div>
                        {isCurrentUserInConnection ? (
                          <button className={styles.connectedButton}>
                            {isConnectionNull ? "Pending" : "Connected"}
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              dispatch(
                                sendConnectionRequest({
                                  token: sessionStorage.getItem("token"),
                                  user_id: userProfile.userId._id,
                                })
                              );
                              
                             

                              await dispatch(
                                getConnectionRequest({
                                  token: sessionStorage.getItem("token"),
                                })
                              );
                             
                              setIsCurrentUserInConnection(true);
                            }}
                            className={styles.connectButton}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    )}

                    <div
                      style={{ width: "1.5rem", cursor: "pointer" }}
                      onClick={async () => {
                        const response = await clientServer.get(
                          `/user/download_resume?id=${userProfile.userId._id}`
                        );

                        window.open(
                          `${base_URL}/${response.data.message}`,
                          "_blank"
                        );
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
                        />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <p>{userProfile.bio}</p>
                  </div>
                </div>
                
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              {userProfile.pastWork.length===0 && <p>No work history</p>}
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.company} - {work.position}
                      </p>
                      <p>{work.years} years</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.workHistory}>
              <h4>Education</h4>
              {userProfile.education.length===0 && <p>No education details</p>}
              <div className={styles.workHistoryContainer}>
                {userProfile.education.map((work, index) => {
                  return (
                    <div key={index} className={styles.workHistoryCard}>
                      <p
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.8rem",
                        }}
                      >
                        {work.school} - {work.degree}
                      </p>
                      <p>{work.fieldStudy} </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ }}>
                  <h3>Recent Activity</h3>
                  <br />
                  {userPosts.length===0 && <p>No recent posts</p>}
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCard}>
                        <div className={styles.card}>
                          <div className={styles.card_profileContainer}>
                            {post.media !== "" ? (
                              <img src={`${base_URL}/${post.media}`} />
                            ) : (
                              <div
                                style={{ width: "3.4rem", height: "3.4rem" }}
                              ></div>
                            )}
                          </div>

                          <p>{post.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    </div>
  );
}

export async function getServerSideProps(context) {
  console.log(context.query.username);

  const request = await clientServer.get("/user/get_profile", {
    params: {
      username: context.query.username,
    },
  });

  const response = await request.data;

  console.log(response);
  return { props: { userProfile: request.data.profile } };
}
