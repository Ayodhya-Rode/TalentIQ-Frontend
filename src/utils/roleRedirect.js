export const redirectForRole = (user, navigate) => {
  if (user.role === "CANDIDATE") {
    navigate("/candidate/dashboard");
  } else if (user.role === "SUPER_ADMIN") {
    navigate("/super-admin/dashboard");
  } else {
    navigate("/");
  }
};