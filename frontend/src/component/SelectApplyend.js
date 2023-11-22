import React from "react";
import DatePicker from "antd/lib/date-picker";
import Space from "antd/lib/space";
import moment from "moment";

export function SELECT_APPLYEND(props) {
	const { onChange, applyEndDate } = props;
	const minDate = moment().add(8, "days");

	const disabledDate = (current) => {
		// 현재 날짜 이후의 날짜는 비활성화
		return current && current < minDate;
	};

	return (
		<>
			{" "}
			<div>신청 마감일</div>
			<Space direction="vertical">
				<DatePicker
					onChange={onChange}
					disabledDate={disabledDate}
					value={applyEndDate}
				/>
			</Space>
		</>
	);
}
