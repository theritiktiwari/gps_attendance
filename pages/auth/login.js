import React from 'react';
const { useEffect, useState } = React;
import Head from "next/head";
import Link from 'next/link';
import { FaCaretLeft } from 'react-icons/fa';

function Login({ tst, siteName, router }) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (document.cookie.includes("user") && document.cookie.split("user=")[1].split(";")[0].length > 0)
            router.push("/");
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (!username || !password) {
            return tst("Please fill all the fields", "error");
        }
        setLoading(true);
        const req = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                unique_id: username,
                password
            })
        });

        const res = await req.json();
        setLoading(false);
        if (res.type === "success") {
            tst(res.message, "success");
            document.cookie = `user=${res.data}; path=/; expires=${new Date(Date.now() + 86400000)};`;
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } else {
            if (Array.isArray(res.message)) {
                (res.message).forEach(error => {
                    tst(error.msg, "error");
                });
            } else {
                tst(res.message, "error");
            }
        }
    }

    return (
        <>
            <Head>
                <title>{`Login | ${siteName}`}</title>
            </Head>

            {/* <div className="back-to-home bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition duration-300 gap-2">
                <Link href={"/"} legacyBehavior><a className="flex justify-center items-center"><FaCaretLeft /> HOME</a></Link>
            </div> */}

            <div className="bg-gray-100 h-screen flex items-center justify-center">
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <form onSubmit={handleSubmit} method="POST">
                        <div className="mb-6">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                            <input id="username" name="username" className="w-full border-2 rounded-md px-4 py-2 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500" placeholder="Enter your ID" />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                            <input type="password" id="password" name="password" className="w-full border-2 rounded-md px-4 py-2 leading-5 transition duration-150 ease-in-out sm:text-sm sm:leading-5 resize-none focus:outline-none focus:border-blue-500" placeholder="Enter your Password" />
                        </div>

                        <div className="flex items-center justify-between w-full">
                            <button type="submit" disabled={loading && true} className="flex justify-center items-center w-full bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue text-white py-2 px-4 rounded-md transition duration-300 gap-2"> {loading && "Processing..." || "Login"} <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" id="send" fill="#fff">
                                <path fill="none" d="M0 0h24v24H0V0z"></path>
                                <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"></path>
                            </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;