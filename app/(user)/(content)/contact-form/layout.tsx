import UserHeader from "../_layout/header";

export default function ContactFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UserHeader heading="Contact Form Received" />

      {children}
    </>
  );
}
