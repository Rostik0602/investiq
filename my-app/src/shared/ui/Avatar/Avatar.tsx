import styles from "./Avatar.module.scss";

interface AvatarProps {
  initial: string;
}

export const Avatar = ({ initial }: AvatarProps) => {
  return <div className={styles.avatar}>{initial}</div>;
};
