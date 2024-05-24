import { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Button, Form } from "antd";

import Loading from "@/components/Loading";
import LoginForm from "@/forms/LoginForm";
import AuthModule from "@/modules/AuthModule";
import { login } from "@/redux/auth/actions";
import { selectAuth } from "@/redux/auth/selectors";

const LoginPage = () => {
	const { isLoading, isSuccess } = useSelector(selectAuth);
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const onFinish = (values) => {
		dispatch(login({ loginData: values }));
	};

	useEffect(() => {
		if (isSuccess) navigate("/");
	}, [isSuccess]);

	const validateMessages = {
		required: "El campo es requerido",
		types: {
			email: "Ingrese un correo válido",
		},
	};

	const FormContainer = () => {
		return (
			<Loading isLoading={isLoading}>
				<Form
					layout="vertical"
					name="normal_login"
					className="login-form"
					initialValues={{
						remember: true,
					}}
					onFinish={onFinish}
					validateMessages={validateMessages}
				>
					<LoginForm />
					<Form.Item>
						<button></button>
						<Button
							className="login-form-button"
							loading={isLoading}
							size="large"
						>
							{"Iniciar sesión"}
						</Button>
					</Form.Item>
				</Form>
			</Loading>
		);
	};

	return (
		<AuthModule authContent={<FormContainer />} AUTH_TITLE="Iniciar sesión" />
	);
};

export default LoginPage;
