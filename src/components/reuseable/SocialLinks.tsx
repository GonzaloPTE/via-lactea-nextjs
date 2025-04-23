// ========================================================
type SocialLinksProps = { className?: string };
// ========================================================

const links = [
  { id: 1, icon: "uil uil-instagram", url: "https://www.instagram.com/vialacteasuenoylactancia/" },
  { id: 2, icon: "uil uil-facebook-f", url: "https://facebook.com/vialactea.suenoylactancia/" }
];

export default function SocialLinks({ className = "nav social social-white mt-4" }: SocialLinksProps) {
  return (
    <nav className={className}>
      {links.map(({ id, icon, url }) => (
        <a href={url} key={id} target="_blank" rel="noreferrer">
          <i className={icon} />
        </a>
      ))}
    </nav>
  );
}
