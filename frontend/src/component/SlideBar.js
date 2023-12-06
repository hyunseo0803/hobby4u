import {
	AiOutlineNotification,
	AiOutlineCheckCircle,
	AiOutlineClockCircle,
	AiOutlineFolderOpen,
	AiOutlineUser,
} from "react-icons/ai";

import {
	RiStackLine,
	RiAdminLine,
	RiGroupLine,
	RiAccountBoxLine,
	RiEmotionHappyLine,
	RiLogoutBoxRLine,
} from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const SlideBar = (props) => {
	const { adminData, handleLogout } = props;

	return (
		<div
			style={{
				width: 90,
				height: "100vh",
				marginTop: 10,
				// justifyContent: "center",
				alignItems: "center",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Link
				to="/manager/dash"
				style={{ margin: 15, textDecorationLine: "none" }}
			>
				<AiOutlineNotification size={30} style={{ margin: 5 }} />
				<div
					style={{
						color: "royalblue",
						textAlign: "center",
					}}
				>
					대시
				</div>
			</Link>
			<Link
				to="judge/ing/tlatkwnd"
				style={{ margin: 15, textDecorationLine: "none" }}
			>
				<AiOutlineClockCircle size={30} style={{ margin: 5 }} />
				<div
					style={{
						color: "royalblue",
						textAlign: "center",
					}}
				>
					심사
				</div>
			</Link>
			<Link
				to="judge/result/tlatkrufrhk"
				style={{ margin: 15, textDecorationLine: "none" }}
			>
				<RiStackLine size={30} style={{ margin: 5 }} />
				<div
					style={{
						color: "royalblue",
						textAlign: "center",
					}}
				>
					결과
				</div>
			</Link>

			{adminData.nickname !== "메인 관리자" && (
				<Link to="memberAndadmin/wjdqh">
					<AiOutlineUser size={30} style={{ margin: 30 }} />
				</Link>
			)}
			{adminData.nickname === "메인 관리자" && (
				<>
					<Link
						to="member/ghldnjs"
						style={{ margin: 15, textDecorationLine: "none" }}
					>
						<RiGroupLine size={30} style={{ margin: 5 }} />
						<div
							style={{
								color: "royalblue",
								textAlign: "center",
							}}
						>
							회원
						</div>
					</Link>
					<Link
						to="manager/wjdqh"
						style={{ margin: 15, textDecorationLine: "none" }}
					>
						<RiAdminLine size={30} style={{ margin: 5 }} />
						<div
							style={{
								color: "royalblue",
								textAlign: "center",
							}}
						>
							관리자
						</div>
					</Link>
				</>
			)}
			{/* <Link to="my/wjdqh">
				<RiEmotionHappyLine
					size={30}
					style={{ marginTop: 60, marginBottom: 30 }}
				/>
			</Link> */}
			<Link to="/manager">
				<button
					style={{
						marginTop: 70,
						marginBottom: 30,
						border: "none",
						backgroundColor: "white",
					}}
					onClick={handleLogout}
				>
					<RiLogoutBoxRLine size={30} />
				</button>
			</Link>
		</div>
	);
};

export default SlideBar;
