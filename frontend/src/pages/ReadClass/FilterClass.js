import "../../styles/ReadClass.css";

export default function FILTER_CLASS(props) {
	const {
		option,
		money,
		apply_ok,
		data,
		handleReadDetail,
		calculateDaysLeft,
		fliteredata,
	} = props;

	return (
		<>
			{option === "" && money === "" && apply_ok === false ? (
				data.map((classItem, index) => (
					<>
						<button
							key={index}
							className="class_div_btn"
							value={classItem.class_id}
							onClick={(e) => handleReadDetail(e.target.value)}
						>
							<strong>Title:</strong>
							{classItem.title}
							<br />
							<strong>Info:</strong>{" "}
							<div
								style={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{classItem.info}
							</div>
							<br />
							{/* <strong>마감 시작:</strong> {classItem.applystart}
        <br />
        <strong>마감 마감:</strong> {classItem.applyend}
        <br /> */}
							{calculateDaysLeft(classItem.applyend) > 0 ? (
								<strong>
									신청 마감 디데이:{calculateDaysLeft(classItem.applyend)}일
									남음
								</strong>
							) : (
								<strong>신청 기간이 아닙니다</strong>
							)}
						</button>
					</>
				))
			) : (
				<div className="row_center_wrap">
					{fliteredata &&
						fliteredata.map((filter, index) => (
							<>
								<button
									key={index}
									className="class_div_btn"
									value={filter.class_id}
									onClick={(e) => handleReadDetail(e.target.value)}
								>
									<strong>Title:</strong>
									{filter.title}
									<br />
									<strong>Info:</strong>{" "}
									<div
										style={{
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{filter.info}
									</div>
									<br />
									{/* <strong>마감 시작:</strong> {classItem.applystart}
        <br />
        <strong>마감 마감:</strong> {classItem.applyend}
        <br /> */}
									{calculateDaysLeft(filter.applyend) > 0 ? (
										<strong>
											신청 마감 디데이: {calculateDaysLeft(filter.applyend)}일
											남음
										</strong>
									) : (
										<strong>신청 기간이 아닙니다</strong>
									)}
								</button>
							</>
						))}
				</div>
			)}
		</>
	);
}
