import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const AlbumSetCover = (props) => {

	const albumCoverSize = () => {
		return {
			width: props.albumSize + 'px',
			height: props.albumSize + 'px'
		}
	}
	/*{Array.apply(null, Array(imageCoverCounter())).map((item, index) => {
                return (
                    <img
                        key={index}
                        className="coverImage"
                        src={props.albumInfo.albumDetails.photo[index].imageURL}
                    />
                )
            })}*/

	return (
		<div style={albumCoverSize()} className="albumCover">

			<div className="albumCoverName">
				<span>{props.albumInfo.albumName}</span>
			</div>
			<div className="albumCoverDescription">
				<span>Photos</span>
			</div>
			<div className="albumOuterContainer">
				<Link to={{
					pathname: `/album`,
					search: `?albumName=${props.albumInfo.albumName}`
				}}>

					<div className="albumInnerContainer">
						<img className={"coverImage" + (props.albumInfo.albumDetails.photo[0].orientation === "landscape"
							? " fullHeight"
							: " fullWIdth")} src={props.albumInfo.albumDetails.photo[0].imageURL}/>
					</div>
				</Link>
			</div>

		</div>
	)
}

AlbumSetCover.PropTypes = {
	albumInfo: PropTypes.array.isRequired
}

export default AlbumSetCover;