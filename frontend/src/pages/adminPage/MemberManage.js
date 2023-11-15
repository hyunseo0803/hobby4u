import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import moment from "moment";

function MemberManage(props) {
	const { getUserList } = props;
	const [userList, setUserList] = useState([]);
	const [sendText, setSendText] = useState("");

	useEffect(() => {
		// 초기 데이터를 생성할 때 key를 추가합니다.
		const initialUserList = getUserList.map((user, index) => ({
			...user,
			key: index + 1,
		}));
		setUserList(initialUserList);
	}, [getUserList]);

	const [searchText, setSearchText] = useState("");
	const [searchedColumn, setSearchedColumn] = useState("");
	const searchInput = useRef(null);
	const handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);
	};
	const handleReset = (clearFilters) => {
		clearFilters();
		setSearchText("");
	};
	const getColumnSearchProps = (dataIndex) => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close,
		}) => (
			<div
				style={{
					padding: 8,
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
					style={{
						marginBottom: 8,
						display: "block",
					}}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{
							width: 90,
						}}
					>
						Search
					</Button>
					<Button
						onClick={() => clearFilters && handleReset(clearFilters)}
						size="small"
						style={{
							width: 90,
						}}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({
								closeDropdown: false,
							});
							setSearchText(selectedKeys[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered) => (
			<SearchOutlined
				style={{
					color: filtered ? "#1677ff" : undefined,
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{
						backgroundColor: "#fdfd96",
						padding: 0,
					}}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ""}
				/>
			) : (
				text
			),
	});
	const columns = [
		{
			title: "nickname",
			dataIndex: "nickname",
			key: "nickname",
			width: "25%",

			...getColumnSearchProps("nickname"),
		},
		{
			title: "email",
			dataIndex: "email",
			key: "email",
			width: "30%",

			...getColumnSearchProps("email"),
		},
		{
			title: "date",
			dataIndex: "date",
			key: "date",
			width: "30%",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.date) - moment(b.date),

			...getColumnSearchProps("date"),
		},
		{
			title: "provider",
			dataIndex: "provider",
			key: "provider",
			width: "30%",

			...getColumnSearchProps("provider"),
		},
	];

	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedEmail, setSelectedEmail] = useState([]);

	const start = () => {
		setLoading(true);
		// ajax request after empty completing
		setTimeout(() => {
			if (selectedRowKeys.length > 0) {
				setSelectedRowKeys([]);
			}
			setLoading(false);
		}, 1000);
	};
	const onSelectChange = (newSelectedRowKeys) => {
		console.log("selectedRowKeys changed: ", newSelectedRowKeys);
		const selectedNicknames = userList
			.filter((user) => newSelectedRowKeys.includes(user.key))
			.map((user) => user.email);
		setSelectedEmail(selectedNicknames);
		setSelectedRowKeys(newSelectedRowKeys);
	};
	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
	};
	const hasSelected = selectedRowKeys.length > 0;

	const sendUserEmail = async () => {
		if (selectedRowKeys.length > 0) {
			try {
				const response = await axios.post(
					"http://localhost:8000/api/manager/send_user_email/",
					{ selectedEmail: selectedEmail, sendText: sendText }
				);
				console.log(response.data.message);
				if (response.data.message === "ok") {
					alert("전송되었습니다.");
					setSendText("");
				}
			} catch (error) {
				console.error("Error registering admin:", error);
			}
		} else {
			alert("이메일을 전송할 1명 이상의 회원을 선택해주세요.");
		}
	};

	useEffect(() => {
		console.log(sendText);
	});

	return (
		<div
			style={{
				backgroundColor: "#d3d3d3",
				width: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					width: "90%",
					backgroundColor: "white",
					height: 400,
					borderRadius: 10,
					padding: 20,
					marginBottom: 10,
				}}
			>
				<Button
					type="primary"
					onClick={start}
					disabled={!hasSelected}
					loading={loading}
				>
					Reload
				</Button>
				<span
					style={{
						marginLeft: 8,
					}}
				>
					{hasSelected ? `총 ${selectedRowKeys.length} 개 선택됨` : ""}
				</span>
				<Table
					rowSelection={rowSelection}
					columns={columns}
					dataSource={userList}
					pagination={false}
					style={{
						overflowX: "auto",
						height: 400,
					}}
				/>
			</div>
			<div
				style={{
					width: "90%",
					backgroundColor: "white",
					height: 220,
					borderRadius: 10,
					padding: 15,
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<textarea
					style={{
						width: "95%",
						height: "100%",
						border: "none",
						resize: "none",
						outline: "none",
					}}
					value={sendText}
					onChange={(e) => setSendText(e.target.value)}
				></textarea>
				<div
					style={{
						width: "95%",
						justifyContent: "flex-end",
						display: "flex",
						marginTop: 8,
					}}
				>
					<button
						style={{
							border: "none",
							width: 100,
							padding: 2,
							backgroundColor: "royalblue",
							color: "white",
							borderRadius: 10,
							fontSize: 14,
						}}
						onClick={sendUserEmail}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
}

export default MemberManage;
