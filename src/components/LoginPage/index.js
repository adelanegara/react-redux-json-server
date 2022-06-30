import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import axios from "axios";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  const checkAccount = (account, values) => {
    const findAccount = account.find((item) => {
      return item.email === values.email;
    });
    if (findAccount) {
      const checkPassword = bcrypt.compareSync(
        values.password,
        account.password
      );
      if (checkPassword) {
        console.log(findAccount);
        //setUserData(checkAccount);
        // onLogin();
        toast.success("Login Succesfully");
      } else {
        toast.error("invalid password");
      }
    } else {
      toast.error("Account doesn't exist");
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      axios
        .get("http://localhost:8888/account")
        .then((response) => checkAccount(response.data, values))
        .catch((error) => toast.error(error.message));
    },
  });

  return (
    <div className="container">
      <div className="col-4">
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button color="primary" variant="contained" fullWidth type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;