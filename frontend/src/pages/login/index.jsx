import UserLayout from "@/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

export default function index() {
  const authState = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [isLoggedIn]);

  const handleRegister = () => {
    dispatch(registerUser({ username, password, name, email }));
  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
  };
  return (
    <>
      <UserLayout>
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer_left}>
              <p className={styles.cardLeft_heading}>
                {isLoggedIn
                  ? "Welcome Back to Connecta"
                  : "Create Your Connecta Account"}
              </p>

              <p style={{ color: authState.isError ? "red" : "grey" }}>
                {authState.message.message}
              </p>
              <div className={styles.inputContainer}>
                <div className={styles.inputRow}>
                  {!isLoggedIn && (
                    <>
                      <input
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles.inputField}
                        type="text"
                        placeholder="Username"
                      />

                      <input
                        onChange={(e) => setName(e.target.value)}
                        className={styles.inputField}
                        type="text"
                        placeholder="Name"
                      />
                    </>
                  )}
                </div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Email"
                />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Password"
                />

                <div
                  className={styles.buttonWithOutline}
                  onClick={() => {
                    if (isLoggedIn) handleLogin();
                    else handleRegister();
                  }}
                >
                  <p>{isLoggedIn ? "Sign in" : "Sign up"}</p>
                </div>
              </div>
            </div>
            <div className={styles.cardContainer_right}>
              {isLoggedIn ? (
                <p>Don't have an account?</p>
              ) : (
                <p>Already have an account?</p>
              )}

              <div
                style={{ color: "black", textAlign: "center" }}
                className={styles.buttonWithOutline}
                onClick={() => {
                  setIsLoggedIn(!isLoggedIn);
                }}
              >
                <p>{isLoggedIn ? "Sign Up" : "Sign In"}</p>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
    </>
  );
}
