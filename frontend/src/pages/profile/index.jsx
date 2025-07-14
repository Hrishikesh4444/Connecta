import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import UserLayout from "@/layout/userLayout";
import DashboardLayout from "@/layout/dashboardLayout";
import { base_URL, clientServer } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import { useRouter } from "next/router";
import { getAllPosts } from "@/config/redux/action/postAction";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.postsReducer);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [inputEducationData, setInputEducationData] = useState({
    school: "",
    degree: "",
    fieldStudy: "",
  });

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setInputEducationData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: sessionStorage.getItem("token") }));
    dispatch(getAllPosts({ token: sessionStorage.getItem("token") }));
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    if (authState.user) {
      setUserProfile(authState.user);
      const post = postState.posts.filter(
        (post) => post.userId.username === authState.user.userId.username
      );
      setUserPosts(post);
    }
  }, [authState.user, postState.posts]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();
    formData.append("profile_picture", file);
    formData.append("token", sessionStorage.getItem("token"));

    await clientServer.post("/upload_profile_picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    dispatch(getAboutUser({ token: sessionStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    await clientServer.post("/user_update", {
      token: sessionStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    await clientServer.post("/update_profile_data", {
      token: sessionStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });

    dispatch(getAboutUser({ token: sessionStorage.getItem("token") }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.userProfileContainer}>
            <div className={styles.backDropContainer}>
              <div className={styles.backDrop}>
                <label className={styles.backDrop_overlay} htmlFor="profile_picture">
                  Edit
                </label>
                <input
                  hidden
                  type="file"
                  id="profile_picture"
                  onChange={(e) => updateProfilePicture(e.target.files[0])}
                />
                <img
                  src={`${base_URL}/${userProfile.userId.profilePicture}`}
                  alt="Profile"
                />
              </div>
            </div>

            <div className={styles.profileConatiner_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div style={{ flex: "0.7" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      type="text"
                      className={styles.name}
                      value={userProfile.userId.name}
                      onChange={(e) =>
                        setUserProfile((prev) => ({
                          ...prev,
                          userId: { ...prev.userId, name: e.target.value },
                        }))
                      }
                    />
                    <p>@{userProfile.userId.username}</p>
                  </div>

                  <div style={{ margin: "1rem 0" }}>
                    <textarea
                      className={styles.bio}
                      value={userProfile.bio}
                      rows={Math.min(3, Math.ceil(userProfile.bio?.length / 80))}
                      onChange={(e) =>
                        setUserProfile((prev) => ({ ...prev, bio: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Work History</h4>
              {userProfile.pastWork.length===0 && <p>No work history</p>}
              <div className={styles.workHistoryContainer}>
                {userProfile.pastWork?.map((work, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p><strong>{work.company} - {work.position}</strong></p>
                    <p>{work.years} years</p>
                  </div>
                ))}
                <button className={styles.addWorkButton} onClick={() => setIsModalOpen(true)}>
                  Add Work
                </button>
              </div>
            </div>

            <div className={styles.workHistory}>
              <h4>Education</h4>
              {userProfile.education.length===0 && <p>No education details</p>}
              <div className={styles.workHistoryContainer}>
                {userProfile.education?.map((edu, index) => (
                  <div key={index} className={styles.workHistoryCard}>
                    <p><strong>{edu.school} - {edu.degree}</strong></p>
                    <p>{edu.fieldStudy}</p>
                  </div>
                ))}
                <button className={styles.addWorkButton} onClick={() => setIsEducationModalOpen(true)}>
                  Add Education
                </button>
              </div>
            </div>

            <div>
              <h3>Recent Activity</h3>
              <br />
              {userPosts.length === 0 && <p>No recent posts</p>}
              {userPosts.map((post) => (
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card_profileContainer}>
                      {post.media ? (
                        <img src={`${base_URL}/${post.media}`} />
                      ) : (
                        <div style={{ width: "3.4rem", height: "3.4rem" }} />
                      )}
                    </div>
                    <p>{post.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.connectButton} onClick={updateProfileData}>
              Update
            </div>
          </div>
        )}

       
        {isModalOpen && (
          <div className={styles.commentsContainer} onClick={() => setIsModalOpen(false)}>
            <div className={styles.allCommentsConatiner} onClick={(e) => e.stopPropagation()}>
              <h4>Enter Work History</h4>
              <input
                name="company"
                className={styles.inputField}
                placeholder="Company"
                onChange={handleWorkInputChange}
              />
              <input
                name="position"
                className={styles.inputField}
                placeholder="Position"
                onChange={handleWorkInputChange}
              />
              <input
                name="years"
                className={styles.inputField}
                placeholder="Years"
                onChange={handleWorkInputChange}
              />
              <div
                className={styles.connectButton}
                onClick={() => {
                  setUserProfile((prev) => ({
                    ...prev,
                    pastWork: [...(prev.pastWork || []), inputData],
                  }));
                  setIsModalOpen(false);
                }}
              >
                Add Work
              </div>
            </div>
          </div>
        )}

        
        {isEducationModalOpen && (
          <div className={styles.commentsContainer} onClick={() => setIsEducationModalOpen(false)}>
            <div className={styles.allCommentsConatiner} onClick={(e) => e.stopPropagation()}>
              <h4>Enter Education Details</h4>
              <input
                name="school"
                className={styles.inputField}
                placeholder="School"
                onChange={handleEducationChange}
              />
              <input
                name="degree"
                className={styles.inputField}
                placeholder="Degree"
                onChange={handleEducationChange}
              />
              <input
                name="fieldStudy"
                className={styles.inputField}
                placeholder="Field of Study"
                onChange={handleEducationChange}
              />
              <div
                className={styles.connectButton}
                onClick={() => {
                  setUserProfile((prev) => ({
                    ...prev,
                    education: [...(prev.education || []), inputEducationData],
                  }));
                  setIsEducationModalOpen(false);
                }}
              >
                Add Education
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
