import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import axios from "axios";

import "../src/App.css";

import JudgeClass from "./pages/adminPage/JudgeClass";
import SlideBar from "./component/SlideBar";
import Dash from "./pages/adminPage/Dash";
import JudgeResult from "./pages/adminPage/JudgeResult";
import MemberManage from "./pages/adminPage/MemberManage";
import AdminInfo from "./pages/adminPage/AdminInfo";
import AdminProfile from "./pages/adminPage/AdminProfile";
import AdminLogin from "./pages/adminPage/AdminLogin";
import Approve from "./pages/adminPage/Approve";
import MAmanage from "./pages/adminPage/MAmanage";
import JudgeClassDetail from "./pages/adminPage/JudgeClassDetail";

class ManagerApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoginAdmin: false,
			adminData: null,
			notJudgeFinish: "",
			isJudgeFinish: "",
			asapJudge: 0,
			asapJudgeList: "",
		};
	}
	async componentDidMount() {
		const manager = localStorage.getItem("manager");

		if (manager !== null) {
			await this.getAdminData();
			await this.finishJudgeCnt();
			await this.deadlineJudge();
		}
		if (!manager) {
			this.setState({
				isLoginAdmin: false,
				adminData: null,
			});
			return;
		}
	}
	finishJudgeCnt = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/manager/get_judge_count/"
			);

			const notFinishCnt = response.data.notFinshCnt;
			const FinishCnt = response.data.finishCnt;
			this.setState({ notJudgeFinish: notFinishCnt, isJudgeFinish: FinishCnt });
		} catch (error) {
			console.error(error);
		}
	};
	deadlineJudge = async () => {
		try {
			const response = await axios.get(
				"http://localhost:8000/api/manager/get_judge_deadline_count/"
			);

			this.setState({
				asapJudge: response.data.deadlineCnt,
				asapJudgeList: response.data.deadline,
			});
		} catch (error) {
			console.error(error);
		}
	};

	getAdminData = async () => {
		try {
			const manager_token = localStorage.getItem("manager");
			if (manager_token !== null) {
				const response = await fetch(
					"http://localhost:8000/api/manager/get_admin_data/",
					{
						method: "POST",
						headers: {
							Authorization: `Bearer ${manager_token}`,
						},
					}
				);
				if (response.ok) {
					const admin = await response.json();

					this.setState({
						adminData: admin,
						isLoginAdmin: true,
					});
				} else {
					// API 호출이 실패, 로그아웃
					this.setState({
						adminData: null,
						isLoginAdmin: false,
					});
				}
			}
		} catch (error) {
			// 예외처리
			console.error(error);
			this.setState({
				adminData: null,
				isLoginAdmin: false,
			});
			return;
		}
	};

	render() {
		const {
			isLoginAdmin,
			adminData,
			isJudgeFinish,
			notJudgeFinish,
			asapJudge,
			asapJudgeList,
		} = this.state;
		const { readFirebasefile } = this.props;

		return (
			<>
				{isLoginAdmin ? (
					<div
						className="Container"
						style={{ display: "flex", flexDirection: "row" }}
					>
						<SlideBar isLoginAdmin={isLoginAdmin} adminData={adminData} />

						<Routes>
							<Route
								path="/"
								element={
									<Dash
										adminData={adminData}
										isJudgeFinish={isJudgeFinish}
										notJudgeFinish={notJudgeFinish}
										asapJudge={asapJudge}
										finishJudgeCnt={this.finishJudgeCnt}
										deadlineJudge={this.deadlineJudge}
									/>
								}
							/>
							<Route
								path="judge/ing/tlatkwnd"
								element={
									<JudgeClass
										adminData={adminData}
										asapJudgeList={asapJudgeList}
										readFirebasefile={readFirebasefile}
									/>
								}
							/>
							<Route
								path="judge/result/tlatkrufrhk"
								element={<JudgeResult adminData={adminData} />}
							/>
							<Route
								path="memberAndadmin/wjdqh"
								element={<MAmanage adminData={adminData} />}
							/>
							<Route
								path="judge/classdetail"
								element={<JudgeClassDetail adminData={adminData} />}
							/>
							<Route
								path="my/wjdqh"
								element={<AdminProfile adminData={adminData} />}
							/>
							<Route
								path="my/fhrmdkdnt"
								element={<JudgeClass adminData={adminData} />}
							/>
							{adminData.nickname === "메인 관리자" && (
								<>
									<Route
										path="member/ghldnjs"
										element={<MemberManage adminData={adminData} />}
									/>
									<Route
										path="manager/wjdqh"
										element={<AdminInfo adminData={adminData} />}
									/>
								</>
							)}
						</Routes>
					</div>
				) : (
					<>
						<Routes>
							<Route
								path="/"
								element={<AdminLogin getAdminData={this.getAdminData} />}
							/>
							<Route path="approve" element={<Approve />} />
						</Routes>
					</>
				)}
			</>
		);
	}
}

export default ManagerApp;
