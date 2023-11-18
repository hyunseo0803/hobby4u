import React from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";

const PaymentButton = (props) => {
	const { money, orderid, ordername, customername } = props;
	const clientKey = process.env.REACT_APP_toss_payments_client_key;
	const payment = () => {
		console.log("결제버튼 눌려짐");
		console.log(money, orderid, ordername, customername);
		loadTossPayments(clientKey).then((tossPayments) => {
			tossPayments
				.requestPayment("카드", {
					amount: money,
					orderId: orderid, // 대충 날짜를 조합하든가 uuid를 사용하는 방법도..
					orderName: ordername,
					customerName: customername,
					successUrl: "http://localhost:3000/toss/success", // ${결제 성공 후 redirect할 url}
					failUrl: "http://localhost:3000/toss/fail", //  ${결제 실패한 경우 redirect할 url}
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
	};

	return (
		<button
			style={{
				width: 350,
				height: 50,
				border: "none",
				backgroundColor: "orange",
				borderRadius: 10,
				color: "white",
				fontWeight: 550,
				fontSize: 20,
				letterSpacing: 5,
			}}
			onClick={payment}
		>
			결제하기
		</button>
	);
};

export default PaymentButton;
