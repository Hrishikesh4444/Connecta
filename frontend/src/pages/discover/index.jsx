import { getAllUsers } from "@/config/redux/action/authAction";
import DashboardLayout from "@/layout/dashboardLayout";
import UserLayout from "@/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { base_URL } from "@/config";
import { useRouter } from "next/router";

export default function DiscoverPage() {
  const authState = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const router = useRouter();
  useEffect(() => {
    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
  }, []);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.discover_container}>

          <h1 className={styles.title}>Discover</h1>

          <div className={styles.allUserProfile}>
          {authState.all_profiles_fetched &&
            authState.all_users.map((user) => (
              <div
                onClick={() => {
                  router.push(`/view_profile/${user.userId?.username}`);
                }}
                key={user.userId?._id}
                className={styles.userCard}
              >
                <img
                  className={styles.userCard_image}
                  src={`${base_URL}/${user.userId?.profilePicture}`}
                  alt="profile-img"
                />
                <div className={styles.userInfo}>
                  <h3>{user.userId?.name}</h3>
                  <p>{user.userId?.email}</p>
                </div>
              </div>
            ))}
        </div>
        </div>
        

        
      </DashboardLayout>
    </UserLayout>
  );
}
