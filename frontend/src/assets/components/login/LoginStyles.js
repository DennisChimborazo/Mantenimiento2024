import styled from "styled-components";

export const LoginContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

export const LoginTitle = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;

  label {
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
    display: block;
    text-align: left;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  background-color: #f9f9f9;
  box-sizing: border-box;
  margin-top: 5px;

  &:focus {
    outline: none;
    border-color: #007BFF;
    background-color: #fff;
  }
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 15px;
  font-size: 14px;
`;

export const LoginButton = styled.button`
  background-color: #007BFF;
  color: #fff;
  border: none;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 15px;

  &:hover {
    background-color: #0056b3;
  }
`;
