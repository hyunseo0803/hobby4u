import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import "../styles/tossPgBTN.css";

const PaymentButton = (props) => {
	const [isHovered, setIsHovered] = useState(false);
	const { money, orderid, ordername, customername, applycnt, applypeople } =
		props;
	const clientKey = process.env.REACT_APP_toss_payments_client_key;
	useEffect(() => {
		console.log(applycnt.toString(), applypeople);
	});
	const payment = () => {
		if (applycnt.toString() === applypeople) {
			alert("모집 인원이 다 찼습니다.");
			return;
		} else {
			loadTossPayments(clientKey).then((tossPayments) => {
				tossPayments
					.requestPayment("카드", {
						amount: money,
						orderId: orderid,
						orderName: ordername,
						customerName: customername,
						successUrl: "http://localhost:3000/toss/success",
						failUrl: "http://localhost:3000/toss/fail",
					})
					.catch(function (error) {
						if (error.code === "USER_CANCEL") {
							// 결제 고객이 결제창을 닫았을 때 에러 처리
						} else if (error.code === "INVALID_CARD_COMPANY") {
							// 유효하지 않은 카드 코드에 대한 에러 처리
						} else {
							console.log(error.code);
						}
					});
			});
		}
	};

	return (
		<button
			className="pay_button"
			onClick={payment}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{isHovered ? (
				<div style={{ fontSize: 20, color: "white" }}>신청 하기</div>
			) : (
				<>
					<div style={{ fontSize: 12, color: "gray" }}>신청 가능</div>
					<div
						style={{
							color: "red",
							fontSize: 20,
						}}
					>
						{applycnt}/{applypeople}
					</div>
				</>
			)}
		</button>
	);
};

export default PaymentButton;
