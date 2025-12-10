import PageTitle from "@/app/components/pageTitle";
import { getUserAsOfficeWorker } from "@/lib/actions/user";
import { getCurrentUser, getUserRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileContent from "./_components/ProfileContent";

const ProfilePage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { dbUser } = currentUser;
  
  // Role'ü güvenli bir şekilde al
  let role: string | null = null;
  try {
    role = await getUserRole(dbUser.id);
  } catch (error) {
    console.error("Error fetching user role:", error);
  }

  // OfficeWorker'ı güvenli bir şekilde al
  let officeWorker = null;
  try {
    officeWorker = await getUserAsOfficeWorker(dbUser.id);
  } catch (error) {
    console.error("Error fetching office worker:", error);
  }

  return (
    <div>
      <PageTitle title="Profilim" linkCaption="Ana sayfaya geri dön" href="/" />
      <ProfileContent dbUser={dbUser} role={role} officeWorker={officeWorker} />
    </div>
  );
};

export default ProfilePage;
