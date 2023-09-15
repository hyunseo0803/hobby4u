import "../styles/CreateClassDetail.css";

import pass from "../assets/pass.png";
import nonpass from "../assets/nonpass.png";

export function OfflinFollowbar(props) {
	const { checkList_offline, listContents_offline } = props;

	return (
		<ul className="follow_bar">
			{checkList_offline.map((checked, index) => (
				<li key={index} style={{ listStyle: "none", margin: 5 }}>
					{checked ? (
						<img src={pass} alt="pass" width={18} style={{ marginRight: 10 }} />
					) : (
						<img
							src={nonpass}
							alt="nonpass"
							width={18}
							style={{ marginRight: 10 }}
						/>
					)}
					{listContents_offline[index]}
				</li>
			))}
		</ul>
	);
}
export function OnlineFollowbar(props) {
	const { checkList_online, listContents_online } = props;

	return (
		<ul className="follow_bar">
			{checkList_online.map((checked, index) => (
				<li key={index} style={{ listStyle: "none", margin: 5 }}>
					{checked ? (
						<img src={pass} alt="pass" width={18} style={{ marginRight: 10 }} />
					) : (
						<img
							src={nonpass}
							alt="nonpass"
							width={18}
							style={{ marginRight: 10 }}
						/>
					)}
					{listContents_online[index]}
				</li>
			))}
		</ul>
	);
}
