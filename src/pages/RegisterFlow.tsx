import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterBusinessInfo from "./RegisterBusinessInfo";
import RegisterBankInfo from "./RegisterBankInfo";
import RegistrationSuccessModal from "../components/RegistrationSuccessModal";

const RegisterFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <>
      {step === 1 && (
        <RegisterBusinessInfo onContinue={() => setStep(2)} />
      )}

      {step === 2 && (
        <RegisterBankInfo
          onBack={() => setStep(1)}
          onSubmit={() => setShowSuccess(true)}
        />
      )}

      <RegistrationSuccessModal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/login");
        }}
      />
    </>
  );
};

export default RegisterFlow;