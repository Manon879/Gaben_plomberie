interface CardProps {
  figureClass: string;
  title: string;
  description: string;
  picture: string;
}

export default function Card({
  figureClass,
  title,
  description,
  picture,
}: CardProps) {
  return (
    <figure className={figureClass}>
      <img src={picture} alt={title} />
      <figcaption className="caption">
        <h3>{title}</h3>
        <p>{description}</p>
      </figcaption>
    </figure>
  );
}
