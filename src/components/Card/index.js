import styles from './Card.module.scss';
import React from 'react';

function Card({ title, imageUrl, price, onPlus, onFavorite }) {
	const [isAdded, setIsAdded] = React.useState(false);

	const onClickPlus = () => {
		onPlus({ title, imageUrl, price });
		setIsAdded(!isAdded);
	}

	return (
		<div className={styles.card}>
			<div className={styles.favorite} onClick={onFavorite}>
				<img src="/img/heart-unliked.svg" alt="Unkliked" />
			</div>
			<img width={133} height={133} src={imageUrl} alt="" />
			<h5>{title}</h5>
			<div className="d-flex justify-between align-center">
				<div className="d-flex flex-column ">
					<span>Цена:</span>
					<b>{price} руб.</b>
				</div>
				<img className={styles.plus} onClick={onClickPlus} src={isAdded ? "/img/btn-checked.svg" : "img/btn-plus.svg"} alt="Plus" />
			</div>
		</div>)
}

export default Card;