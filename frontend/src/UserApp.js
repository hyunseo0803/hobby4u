import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import UserHeader from "./component/UserHeader";
import Footer from "./component/Footer";
import Intro from "./pages/Intro";
import "../src/App.css";
import Setting from "./pages/Setting";
import Myclass from "./pages/Myclass";
import Judge from "./pages/Judge";
import CreateClass from "./pages/CreateClass/CreateClass";
import CreateClassDetail from "./pages/CreateClass/CreateClassDetail";
import ReadClass from "./pages/ReadClass/ReadClass";
import ReadClassDetail from "./pages/ReadClass/ReadClassDetail";
import TossSuccess from "./pages/TossSuccess.tsx";
import TossFail from "./pages/TossFail.tsx";
import CompletePayment from "./common/CompletePayment.js";
import CashBack from "./pages/CashBack.js";
import axios from "axios";

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

			const response = await axios.post(
				"http://localhost:8000/api/user/get_user_data/",
				{
					token: token,
				}
			);
			const user = response.data.response_data;
			// 사용자 정보를 가져온 후 상태를 업데이트하는 콜백 함수
			this.setState({ userData: user, isLoggedIn: true }, () => {
				// 상태가 업데이트된 후에 실행되는 로직
				// 이곳에서 헤더를 다시 렌더링하거나 기타 작업을 수행할 수 있습니다.
				console.log("User data fetched successfully");
			});
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
		const { readFirebasefile } = this.props;
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
						element={
							<ReadClass
								isLoggedIn={isLoggedIn}
								userData={userData}
								readFirebasefile={readFirebasefile}
							/>
						}
					/>
					<Route path="intro" element={<Intro />} />
					<Route path="gide" element={<Intro />} />
					<Route
						path="readClass/classDetail"
						element={
							<ReadClassDetail
								isLoggedIn={isLoggedIn}
								readFirebasefile={readFirebasefile}
							/>
						}
					/>
					{isLoggedIn && (
						<>
							<Route
								path="myclass"
								element={
									<Myclass
										userData={userData}
										readFirebasefile={readFirebasefile}
									/>
								}
							/>
							<Route
								path="takingclass"
								element={
									<Myclass
										userData={userData}
										readFirebasefile={readFirebasefile}
									/>
								}
							/>
							<Route
								path="judge"
								element={
									<Judge
										userData={userData}
										readFirebasefile={readFirebasefile}
									/>
								}
							/>
							<Route path="createclass" element={<CreateClass />} />
							<Route
								path="createClass/detail"
								element={<CreateClassDetail />}
							/>
							<Route
								path="setting"
								element={<Setting readFirebasefile={readFirebasefile} />}
							/>
							<Route path="toss/success" element={<TossSuccess />} />
							<Route path="toss/fail" element={<TossFail />} />
							<Route path="complete/payment" element={<CompletePayment />} />
							<Route
								path="my/cashback"
								element={
									<CashBack
										userData={userData}
										getUserData={this.getUserData}
									/>
								}
							/>
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
