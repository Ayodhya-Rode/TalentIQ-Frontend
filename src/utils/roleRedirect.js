export const redirectForRole = (user, navigate) => {
  if (user.role === "CANDIDATE") {
    navigate("/candidate/dashboard");
  } else if (user.role === "SUPER_ADMIN") {
    navigate("/super-admin/dashboard");
  } else if (user.role === "ORG_ADMIN") {
    navigate("/org-admin");
  } else if (user.role === "RECRUITER") {
    navigate("/recruiter/dashboard");
  } else if (user.role === "INTERVIEWER") {
    navigate("/interviewer/dashboard");
  } else {
    navigate("/");
  }
};
