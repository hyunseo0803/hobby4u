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
				width: 80,
				height: "100vh",
				marginTop: 10,
				// justifyContent: "center",
				alignItems: "center",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<Link to="/manager">
				<AiOutlineNotification size={30} style={{ margin: 30 }} />
			</Link>
			<Link to="judge/ing/tlatkwnd">
				<AiOutlineClockCircle size={30} style={{ margin: 30 }} />
			</Link>
			<Link to="judge/result/tlatkrufrhk">
				<RiStackLine size={30} style={{ margin: 30 }} />
			</Link>

			{adminData.nickname !== "메인 관리자" && (
				<Link to="memberAndadmin/wjdqh">
					<AiOutlineUser size={30} style={{ margin: 30 }} />
				</Link>
			)}
			{adminData.nickname === "메인 관리자" && (
				<>
					<Link to="member/ghldnjs">
						<RiGroupLine size={30} style={{ margin: 30 }} />
					</Link>
					<Link to="manager/wjdqh">
						<RiAdminLine size={30} style={{ margin: 30 }} />
					</Link>
				</>
			)}
			<Link to="my/wjdqh">
				<RiEmotionHappyLine
					size={30}
					style={{ marginTop: 60, marginBottom: 30 }}
				/>
			</Link>
			<Link to="/manager">
				<button
					style={{ border: "none", backgroundColor: "white" }}
					onClick={handleLogout}
				>
					<RiLogoutBoxRLine size={30} />
				</button>
			</Link>
		</div>
	);
};

export default SlideBar;
