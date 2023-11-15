import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table } from "antd";
import moment from "moment";

function AdminInfo(props) {
	const {
		getAdminList,
		getNotAdminList,
		getUserAdminlist,
		getNotApproveAdmin,
	} = props;
	useEffect(() => {
		getAdminList.forEach(function (obj, index) {
			obj["key"] = index + 1;
		});
	}, []);

	useEffect(() => {
		getNotAdminList.forEach(function (obj, index) {
			obj["key"] = index + 1;
		});
	}, []);

	const handleApprove = async (approveNickname) => {
		try {
			const confirmApprove = window.confirm(
				`${approveNickname.nickname}을 정말 승인하시겠습니까?`
			);
			if (confirmApprove) {
				const response = await axios.post(
					"http://localhost:8000/api/manager/change_approve/",
					{
						ApproveNickname: approveNickname.nickname,
					}
				);
				alert("승인처리 되었습니다.");
				await getUserAdminlist();
				await getNotApproveAdmin();
			}
		} catch (err) {
			console.error(err);
		}
	};
	const handleDelete = async (approveNickname) => {
		try {
			const confirmApprove = window.confirm(
				`${approveNickname.nickname}의 계정을 비승인 처리 하시겠습니까?`
			);
			if (confirmApprove) {
				const response = await axios.post(
					"http://localhost:8000/api/manager/delete_admin/",
					{
						deleteNickname: approveNickname.nickname,
					}
				);
				alert("비승인 처리 되었습니다.");
				await getUserAdminlist();
				await getNotApproveAdmin();
			}
		} catch (err) {
			console.error(err);
		}
	};

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
	const AdminColumns = [
		{
			title: "nickname",
			dataIndex: "nickname",
			key: "nickname",
			width: "25%",

			...getColumnSearchProps("nickname"),
		},
		{
			title: "phone",
			dataIndex: "phone",
			key: "phone",
			width: "25%",

			...getColumnSearchProps("phone"),
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
			width: "35%",
			defaultSortOrder: "descend",
			sorter: (a, b) => moment(a.date) - moment(b.date),

			...getColumnSearchProps("date"),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Space size="middle">
					<Button onClick={() => handleDelete(record)}>Revoke</Button>
				</Space>
			),
		},
	];
	const notAdminColumns = [
		{
			title: "nickname",
			dataIndex: "nickname",
			key: "nickname",
			width: "30%",

			...getColumnSearchProps("nickname"),
		},
		{
			title: "phone",
			dataIndex: "phone",
			key: "phone",
			width: "30%",

			...getColumnSearchProps("phone"),
		},
		{
			title: "email",
			dataIndex: "email",
			key: "email",
			width: "30%",

			...getColumnSearchProps("email"),
		},
		{
			title: "Action",
			key: "action",
			render: (text, record) => (
				<Space size="middle">
					<Button onClick={() => handleApprove(record)}>Approve</Button>
				</Space>
			),
		},
	];
	return (
		<div
			style={{
				backgroundColor: "#d3d3d3",
				width: "100%",
				justifyContent: "center",
				flexDirection: "column",
				display: "flex",
				alignItems: "center",
			}}
		>
			<div
				style={{
					backgroundColor: "white",
					width: "85%",
					// height: 640,
					borderRadius: 10,
					padding: 10,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
					marginBottom: 10,
				}}
			>
				<div
					style={{
						padding: 10,
						textAlign: "center",
						fontWeight: "bolder",
					}}
				>
					관리자 목록
				</div>
				<div>
					<Table
						columns={AdminColumns}
						dataSource={getAdminList}
						pagination={false}
						style={{
							overflowX: "auto",
							marginBottom: 20,
							height: 250,
						}}
					/>
				</div>
			</div>
			<div
				style={{
					backgroundColor: "white",
					width: "85%",
					borderRadius: 10,
					padding: 10,
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-around",
				}}
			>
				<div
					style={{
						padding: 10,
						textAlign: "center",
						fontWeight: "bolder",
					}}
				>
					관리자 승인 대기 목록
				</div>

				<div>
					<Table
						columns={notAdminColumns}
						dataSource={getNotAdminList}
						pagination={false}
						style={{
							overflowX: "auto",
							marginBottom: 20,
							height: 230,
						}}
					/>
				</div>
			</div>
		</div>
	);
}

export default AdminInfo;
