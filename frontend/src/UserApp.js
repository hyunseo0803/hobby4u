import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import UserHeader from "./component/UserHeader";
import Footer from "./component/Footer";
import Intro from "./pages/Intro";
import "../src/App.css";
import Setting from "./pages/Setting";
import Myclass from "./pages/Myclass";
import Likeclass from "./pages/Likeclass";
import Judge from "./pages/Judge";
import CreateClass from "./pages/CreateClass/CreateClass";
import CreateClassDetail from "./pages/CreateClass/CreateClassDetail";
import ReadClass from "./pages/ReadClass/ReadClass";
import ReadClassDetail from "./pages/ReadClass/ReadClassDetail";
// import SearchClass from "./pages/SerchClass";
// import { IssueClosedIcon } from "@primer/octicons-react";
// import JudgeClass from "./pages/adminPage/JudgeClass";

class UserApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false,
			userData: null,
		};
	}
	componentDidMount() {
		const token = localStorage.getItem("token");
		if (token) {
			// 로그인한 경우 사용자 정보를 가져옴
			this.getUserData();
		}
		if (!token) {
			this.setState({ isLoggedIn: false, userData: null });
			return;
		}
	}

	getUserData = async () => {
		// if (isLoggedIn) {
		try {
			const token = localStorage.getItem("token");

			const response = await fetch(
				"http://localhost:8000/api/user/get_user_data/",
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`, // JWT 토큰을 Authorization header에 포함시킴
					},
				}
			);
			if (response.ok) {
				const user = await response.json();
				// 사용자 정보를 가져온 후 상태를 업데이트하는 콜백 함수
				this.setState({ userData: user, isLoggedIn: true }, () => {
					// 상태가 업데이트된 후에 실행되는 로직
					// 이곳에서 헤더를 다시 렌더링하거나 기타 작업을 수행할 수 있습니다.
					console.log("User data fetched successfully");
				});
			} else {
				// API 호출이 실패한 경우 에러 처리 로직 추가
				throw new Error("Failed to fetch user data");
			}
		} catch (error) {
			// 예외처리
			console.error(error);
			// 헤더를 로그아웃 상태로 렌더링하거나 기타 작업을 수행할 수 있습니다.
			this.setState({ userData: null, isLoggedIn: false });
			return;
			// }
		}
	};

	render() {
		const { isLoggedIn, userData } = this.state;
		return (
			// <BrowserRouter>
			<div className="Container">
				{isLoggedIn ? (
					<UserHeader userData={userData} />
				) : (
					<Header getUserData={this.getUserData} />
				)}
				<Routes>
					<Route
						path="/"
						element={<ReadClass isLoggedIn={isLoggedIn} userData={userData} />}
					/>
					<Route path="intro" element={<Intro />} />
					<Route path="gide" element={<Intro />} />
					<Route
						path="readClass/classDetail"
						element={<ReadClassDetail isLoggedIn={isLoggedIn} />}
					/>
					{isLoggedIn && (
						<>
							<Route path="myclass" element={<Myclass userData={userData} />} />
							<Route
								path="takingclass"
								element={<Myclass userData={userData} />}
							/>
							<Route path="judge" element={<Judge userData={userData} />} />
							<Route
								path="likeclass"
								element={<Likeclass userData={userData} />}
							/>
							<Route path="createclass" element={<CreateClass />} />
							<Route
								path="createClass/detail"
								element={<CreateClassDetail />}
							/>
							<Route path="setting" element={<Setting />} />
						</>
					)}
				</Routes>

				<Footer />
			</div>
			// </BrowserRouter>
		);
	}
}

export default UserApp;
