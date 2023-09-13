// import React, { useState, useEffect } from "react";

import "../styles/CreateClassDetail.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";
import DaumPostCode from "react-daum-postcode";
import Place_search_icon from "../assets/place_search_icon.png";

export default function CreateOfflineClass(props) {
	const {
		handleComplete,
		isOpen,
		applyStartDate,
		onChangeApply,
		applyEndDate,
		toStringApplyStartDate,
		toStringApplyEndDate,
		activityStartDate,
		onChangeActivity,
		activityEndDate,
		toStringActivityStartDate,
		toStringActivityEndDate,
		address,
		handleModal,
	} = props;

	return (
		<div className="flex_row" style={{ justifyContent: "center" }}>
			<div className="period_place">
				<div className="flex_row" style={{ marginBottom: 10 }}>
					<div className="period_place_label">신청 기간</div>
					<div className="period_place_label_hint">
						클래스 신청 기간을 선택해 주세요.{" "}
					</div>
				</div>
				<div>
					<div className="calender-container">
						<div className="calender-box">
							<div
								className="flex_center"
								style={{ marginTop: 10, height: 245 }}
							>
								<DatePicker
									locale={ko}
									selected={applyStartDate}
									onChange={onChangeApply}
									startDate={applyStartDate}
									endDate={applyEndDate}
									selectsRange
									inline
								/>
							</div>
						</div>
						<div className="selected_result">
							{applyEndDate !== null ? (
								<div className="calender-box">
									{toStringApplyStartDate} - {toStringApplyEndDate}
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<div className="period_place">
				<div className="flex_row" style={{ marginBottom: 10 }}>
					<div className="period_place_label">활동 기간</div>
					<div className="period_place_label_hint">
						클래스 활동 기간을 선택해 주세요.
					</div>
				</div>

				<div className="period_place_choice">
					<div className="datepicker">
						<div className="flex_center" style={{ marginTop: 10, height: 245 }}>
							<DatePicker
								locale={ko}
								selected={activityStartDate}
								onChange={onChangeActivity}
								startDate={activityStartDate}
								endDate={activityEndDate}
								selectsRange
								inline
							/>
						</div>
					</div>
				</div>
				<div className="selected_result">
					{activityEndDate !== null ? (
						<div className="calender-box">
							{toStringActivityStartDate} - {toStringActivityEndDate}
						</div>
					) : null}
				</div>
			</div>
			<div className="period_place">
				<div className="flex_row" style={{ marginBottom: 10 }}>
					<div className="period_place_label">활동 장소</div>
					<div className="period_place_label_hint">
						클래스 활동 장소를 선택해 주세요.
					</div>
				</div>
				<div className="period_place_choice">
					<div className="flext_center">
						{isOpen ? (
							<div className="Address_modal_wrapper">
								<div className="Address_modal_content">
									<DaumPostCode
										setModalOpen={isOpen}
										onComplete={handleComplete}
										className="post-code"
									/>
								</div>
							</div>
						) : null}
					</div>
					{address ? (
						<>
							<div
								className="map"
								style={{
									justifyContent: "center",
									width: "100%",
									height: 245,
									margin: "auto",
								}}
							></div>
							<div className="selected_result">
								{address !== null ? (
									<div className="calender-box">{address}</div>
								) : null}
							</div>
						</>
					) : (
						<div className="flex_center" style={{ width: "100%", height: 245 }}>
							<img src={Place_search_icon} onClick={handleModal} alt="" />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
