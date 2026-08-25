export const redirectForRole = (user, navigate) => {
  if (user.role === "CANDIDATE") {
    navigate("/candidate/dashboard");
  } else {
    navigate("/");
  }
};