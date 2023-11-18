import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Result from "antd/lib/result";
import Button from "antd/lib/button";
import React from "react";

function CompletePayment() {
	const location = useLocation();
	const payinfo = location.state.payinfo;

	useEffect(() => {
		console.log(payinfo);
	}, []);

	return (
		<div style={{ margin: 150 }}>
			{/* <div>주문 번호: {payinfo.orderId}</div>
			<div>주문 이름: {payinfo.orderName}</div>
			<div>결제 금액:{payinfo.totalAmount}</div> */}
			<Result
				status="success"
				title="Successfully Purchased"
				subTitle={
					<>
						주문 번호: {payinfo.orderId}
						<br />
						주문 이름: {payinfo.orderName}
						<br />
						<br />총 결제 금액: {payinfo.totalAmount}
					</>
				}
				extra={[
					<Button type="primary" key="console">
						수강 중인 클래스
					</Button>,
					<Button key="buy">더 구경하기</Button>,
				]}
			/>
		</div>
	);
}

export default CompletePayment;
