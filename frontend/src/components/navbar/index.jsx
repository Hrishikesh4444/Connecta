import React, { useEffect } from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { reset } from '../../config/redux/reducer/authReducer/index.js'
import { getAboutUser } from "@/config/redux/action/authAction";

const Navbar = () => {
  const router = useRouter();

  const authState = useSelector((state) => state.auth);

  const dispatch=useDispatch()

  useEffect(()=>{
    dispatch(getAboutUser({ token: sessionStorage.getItem("token") }))
  },[])
  return (
    <div className={styles.container}>
      <nav className={styles.navBar}>
        <h1
          onClick={() => {
            router.push("/");
          }}
        >
          Connecta
        </h1>

        <div className={styles.navBarOptionContainer}>

          {authState.profileFetched && (
            <div
              style={{display: "flex", gap: "1.2rem"}}
            >
              
              <p onClick={()=> router.push("/profile")} style={{fontWeight: "bold",cursor: "pointer"}} className={styles.profile}> Profile</p>
              <p onClick={()=>{
                sessionStorage.removeItem('token')
                router.push('/login')
                dispatch(reset())
              }} style={{fontWeight: "bold",cursor: "pointer"}} className={styles.logout}> Log out</p>
            </div>
          )}

          {!authState.profileFetched && (
            <div
              className={styles.buttonJoin}
              onClick={() => {
                router.push("/login");
              }}
            >
              <p>Be a part</p>
            </div>
          )}
          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
