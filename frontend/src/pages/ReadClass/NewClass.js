import "../../styles/ReadClass.css";

export default function NEW_CLASS(props) {
	const { newdata, handleReadDetail, calculateDaysLeft } = props;

	return newdata.map((newItem, index) => (
		<>
			<button
				key={index}
				className="class_div_btn"
				value={newItem.class_id}
				onClick={(e) => handleReadDetail(e.target.value)}
			>
				<strong>Title:</strong>
				{newItem.title}
				<br />
				<strong>Info:</strong>{" "}
				<div
					style={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					}}
				>
					{newItem.info}
				</div>
				<br />
				{calculateDaysLeft(newItem.applyend) > 0 ? (
					<strong>
						신청 마감 디데이:{calculateDaysLeft(newItem.applyend)}일 남음
					</strong>
				) : (
					<strong>신청 기간이 아닙니다</strong>
				)}
			</button>
		</>
	));
}
