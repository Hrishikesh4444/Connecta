import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/userLayout";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <UserLayout>
        <div className={styles.container}>
          <div className={styles.main_container}>
            <div className={styles.main_container_left}>
              <p>Welcome to Connecta - where real connections happen</p>
              <p>
                Join a professional community built on authenticity and growth.
              </p>

              <div
                onClick={() => {
                  router.push("/login");
                }}
                className={styles.join_button}
              >
                <p>Join Now</p>
              </div>
            </div>

            <div className={styles.main_container_right}>
              <img
                src="/images/main-container-img.svg"
                alt=""
                width={500}
                height={500}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </UserLayout>
    </>
  );
}
