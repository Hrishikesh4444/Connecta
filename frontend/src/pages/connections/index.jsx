import {
  acceptConnection,
  getAllUsers,
  getConnectionRequest,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { base_URL } from "@/config";
import { useRouter } from "next/router";

export default function ConnectionsPage() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: sessionStorage.getItem("token") }));
    dispatch(getConnectionRequest({ token: sessionStorage.getItem("token") }));
    dispatch(getAllUsers());
  }, []);

  const router = useRouter();
  return (
    <UserLayout>
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.6rem",
            padding: "1.3rem",
            height: "83vh",
          }}
        >
          <h1>My Connections</h1>

          {authState.connections.filter(
            (connection) => connection.status_accepted === null
          ).length === 0 && (
            <div>
              <p>No connection requests found.</p>
            </div>
          )}

          {authState.connections.length !== 0 &&
            authState.connections
              .filter((connection) => connection.status_accepted === null)
              .map((user) => {
                return (
                  <div
                    onClick={() =>
                      router.push(`/view_profile/${user.userId.username}`)
                    }
                    className={styles.userCard}
                    key={user._id}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1.2rem",
                      }}
                    >
                      <div className={styles.profilePicture}>
                        <img
                          src={`${base_URL}/${user.userId.profilePicture}`}
                          alt=""
                        />
                      </div>

                      <div className={styles.profile_button_div}>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>@{user.userId.username}</p>
                        </div>

                        <div style={{display: "flex", gap: "1rem"}}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                acceptConnection({
                                  connectionId: user._id,
                                  token: sessionStorage.getItem("token"),
                                  action: "accept",
                                })
                              );
                            }}
                            className={styles.acceptButton}
                          >
                            accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                acceptConnection({
                                  connectionId: user._id,
                                  token: sessionStorage.getItem("token"),
                                  action: "reject",
                                })
                              );
                            }}
                            className={styles.rejectButton}
                          >
                            reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

          <h4>My Network</h4>
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted === true)
            .map((user, index) => {
              return (
                <div
                  onClick={() =>
                    router.push(`/view_profile/${user.connectionId.username}`)
                  }
                  className={styles.userCard}
                  key={user._id}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={`${base_URL}/${user.connectionId.profilePicture}`}
                        alt=""
                      />
                    </div>

                    <div className={styles.userInfo}>
                      <h3>{user.connectionId.name}</h3>
                      <p>@{user.connectionId.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          {authState.connections
            .filter((connection) => connection.status_accepted === true)
            .map((user, index) => {
              return (
                <div
                  onClick={() =>
                    router.push(`/view_profile/${user.userId.username}`)
                  }
                  className={styles.userCard}
                  key={user._id}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <div className={styles.profilePicture}>
                      <img
                        src={`${base_URL}/${user.userId.profilePicture}`}
                        alt=""
                      />
                    </div>

                    <div className={styles.userInfo}>
                      <h3>{user.userId.name}</h3>
                      <p>@{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
