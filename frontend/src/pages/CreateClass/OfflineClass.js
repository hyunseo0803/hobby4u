import "../../styles/CreateClassDetail.css";
import moment from "moment";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/esm/locale";
import "react-datepicker/dist/react-datepicker.css";
import DaumPostCode from "react-daum-postcode";
import Place_search_icon from "../../assets/place_search_icon.png";
import Swal from "sweetalert2";
import { IoIosSearch } from "react-icons/io";

import minus from "../../assets/day_class_minus.png";
import add from "../../assets/day_class_add.png";

import edit from "../../assets/edit.png";
import remove from "../../assets/remove.png";

export function PLACE_PERIOD(props) {
	const {
		handleComplete,
		isOpen,
		onChangeApply,
		applyEndDate,
		activityStartDate,
		onChangeActivity,
		activityEndDate,
		address,
		handleModal,
	} = props;

	const todaymin = new Date();
	todaymin.setDate(todaymin.getDate() + 8);

	const activitymin = new Date();

	if (applyEndDate) {
		activitymin.setDate(applyEndDate.getDate() + 1);
	}

	return (
		<div className="mo_flex_row" style={{ justifyContent: "center" }}>
			<div className="period_place">
				<div style={{ marginBottom: 10 }}>
					<div className="period_place_label">신청 마감</div>
					<div className="period_place_label_hint_box">
						<div className="period_place_label_hint">
							클래스 심사는 등록 기준 최대 7일이 소요되며,
						</div>
						<div className="period_place_label_hint">
							심사 기간 이후 날짜로 설정 할 수 있습니다.
						</div>
					</div>
				</div>
				<div>
					<div className="calender-container">
						<div className="calender-box">
							<div
								className="flex_center"
								style={{
									marginTop: 10,
									height: 300,
								}}
							>
								<DatePicker
									locale={ko}
									selected={applyEndDate}
									onChange={onChangeApply}
									minDate={todaymin}
									inline
								/>
							</div>
						</div>
						<div className="selected_result">
							{applyEndDate !== null ? (
								<div className="calender-box">
									{moment(applyEndDate).format("YYYY-MM-DD")}
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
			<div className="period_place">
				<div style={{ marginBottom: 10 }}>
					<div className="period_place_label">활동 기간</div>
					<div className="period_place_label_hint_box">
						<div className="period_place_label_hint">
							클래스 활동 기간을 선택해 주세요.
						</div>
					</div>
				</div>

				<div className="calender-container">
					<div className="calender-box">
						<div
							className="flex_center"
							style={{
								marginTop: 10,
								height: 300,
								margin: "auto",
							}}
						>
							<DatePicker
								locale={ko}
								selected={activityStartDate}
								onChange={onChangeActivity}
								startDate={activityStartDate}
								endDate={activityEndDate}
								minDate={activitymin}
								selectsRange
								inline
							/>
						</div>
					</div>
				</div>
				<div className="selected_result">
					{activityEndDate !== null ? (
						<div className="calender-box">
							{moment(activityStartDate).format("YYYY-MM-DD")} -
							{moment(activityEndDate).format("YYYY-MM-DD")}
						</div>
					) : null}
				</div>
			</div>
			<div className="period_place">
				<div style={{ marginBottom: 10 }}>
					<div className="period_place_label">활동 장소</div>
					<div className="period_place_label_hint_box">
						<div className="period_place_label_hint">
							클래스 활동 장소를 선택해 주세요.
						</div>
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
						<div
							className="flex_center"
							style={{
								marginTop: 10,
								height: 300,
								margin: "auto",
							}}
						>
							<button
								className="flex_center"
								style={{
									width: 200,
									height: 200,
									backgroundColor: "transparent",
									border: "1px solid gray",
									borderRadius: 10,
								}}
								onClick={handleModal}
							>
								<IoIosSearch size={100} />
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export function DAY_PLAN(props) {
	const {
		days,
		isImage,
		handleDayRemoveImg,
		activityStartDate,
		activityEndDate,
		onChangeImage_day,
		handleChange,
		handleRemoveDay,
		handleAddDay,
	} = props;

	const Toast = Swal.mixin({
		toast: true,
		position: "center-center",
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener("mouseenter", Swal.stopTimer);
			toast.addEventListener("mouseleave", Swal.resumeTimer);
		},
	});

	return (
		<div className="daydetail_all_wrapper">
			<div className="large_label" style={{ marginBottom: 20 }}>
				DAY별 클래스 상세 소개
			</div>
			<div className="dayclasswrapper">
				<div>
					{days.map((day) => (
						<div
							key={day.id}
							className="flex_center"
							style={{ flexDirection: "column" }}
						>
							<div className="day_title_label">{day.id}</div>
							<div className="flex_center">
								{day.dayImgpreview || day.dayVideopreview ? (
									<>
										<div className="background_day_img">
											{isImage ? (
												<>
													<img
														src={day.dayImgpreview}
														style={{
															objectFit: "cover",
															width: "80%",
															maxHeight: 500,
															justifyContent: "center",
															maxWidth: "100%",
															height: "auto",
														}}
														alt="preview-img"
													/>
												</>
											) : (
												<video
													src={day.dayVideopreview}
													style={{
														objectFit: "cover",
														width: "80%",
														maxHeight: 500,
														justifyContent: "center",
														maxWidth: "100%",
														height: "auto",
													}}
													controls
												/>
											)}

											<button
												className="editImg_text"
												onClick={() => {
													const inputElement = document.getElementById(
														`day_img_input_${day.id}`
													);
													if (inputElement) {
														inputElement.click();
													}
												}}
											>
												<img src={edit} width={22} alt="edit" />
											</button>
											<button
												className="editImg_text"
												style={{ top: 35 }}
												onClick={() => handleDayRemoveImg(day.id)}
											>
												<img src={remove} width={22} alt="edit" />
											</button>
										</div>
									</>
								) : (
									<>
										<button
											className="uploadImg_behind"
											onClick={() => {
												const inputElement = document.getElementById(
													`day_img_input_${day.id}`
												);
												if (inputElement) {
													inputElement.click();
												}
											}}
										>
											<img
												width="50"
												height="50"
												src="https://img.icons8.com/ios/50/image--v1.png"
												alt="--v1"
											/>
										</button>
									</>
								)}

								<input
									type="file"
									accept="image/*,video/*"
									id={`day_img_input_${day.id}`}
									style={{ display: "none" }}
									onChange={(e) => {
										const minSizeInBytes = 200 * 200;
										if (e.target.files[0].size < minSizeInBytes) {
											Toast.fire({
												icon: "error",
												title:
													"이미지/영상의 크기가 너무 작습니다. 다시 선택해주세요.",
											});
										} else {
											onChangeImage_day(e.target.files[0], `day_img_${day.id}`);
										}
									}}
								/>
							</div>
							<div
								style={{ width: "100%", display: "flex", flexDirection: "row" }}
							>
								<input
									className="day_input_text"
									style={{ width: "100%" }}
									type="text"
									maxLength={50}
									name={`title_${day.id}`}
									placeholder="제목"
									value={day.title}
									onChange={(e) =>
										handleChange(day.id, "title", e.target.value)
									}
								/>
								<input
									className="day_input_text"
									style={{ width: 250 }}
									type="date"
									dateFormat="yyyy-MM-dd"
									name={`date_${day.id}`}
									placeholder="날짜"
									value={day.date}
									minDate={activityStartDate}
									maxDate={activityEndDate}
									onChange={(e) => handleChange(day.id, "date", e.target.value)}
								/>
							</div>

							<div style={{ justifyContent: "flex-start" }}>
								<textarea
									className="day_input_text"
									style={{ width: 950 }}
									type="text"
									multiple="true"
									name={`content_${day.id}`}
									placeholder="내용"
									value={day.content}
									onChange={(e) =>
										handleChange(day.id, "content", e.target.value)
									}
								/>
							</div>
							<div style={{ border: "none" }}>
								{days.length > 1 && day.id === days[days.length - 1].id && (
									<button
										className="remove_button"
										style={{
											border: "none",
											backgroundColor: "transparent",
											margin: 5,
										}}
										onClick={() => handleRemoveDay(day.id)}
									>
										<img src={minus} width={25} alt="minus" />
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="add_button_wrapper">
				<button className="add_button" onClick={handleAddDay}>
					<img src={add} width={25} alt="minus" />
				</button>
			</div>
		</div>
	);
}
