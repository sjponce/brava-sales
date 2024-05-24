import { MailOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import React from "react";

export default function ForgetPasswordForm() {
	return (
		<Form.Item
			name="email"
			rules={[
				{
					required: true,
				},
				{
					type: "email",
				},
			]}
		>
			<Input
				prefix={<MailOutlined className="site-form-item-icon" />}
				type="email"
				placeholder={"email"}
				size="large"
			/>
		</Form.Item>
	);
}
