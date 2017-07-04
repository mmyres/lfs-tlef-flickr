import React from 'react';
import R from 'ramda';
import Lightbox from 'react-images';
import API from '../API/API';
import DescriptionAPI from '../API/DescriptionAPI';
import SearchBar from '../components/SearchBar';
import SelectSearchBar from '../components/SelectSearchBar';
import Photos from '../components/Photos';

export default class GalleryContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            selectSearch: '',
            //search by words
            searchBarKey: '',
            photos: [],
            visiblePhotos: [],
            allSelectOptions: [],
            currentSelectOptions:[],
            currentImage: 0,
            lightboxIsOpen: false,
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.closeLightbox = this.closeLightbox.bind(this);
		    this.gotoNext = this.gotoNext.bind(this);
		    this.gotoPrevious = this.gotoPrevious.bind(this);
		    this.handleClickImage = this.handleClickImage.bind(this);
		    this.openLightbox = this.openLightbox.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.getLightboxImages = this.getLightboxImages.bind(this);
        this.callAPI = this.callAPI.bind(this)
        // this.filterPhotos = this.filterPhotos.bind(this);
        this.isMatchingTag = this.isMatchingTag.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.filterSelectPhotos = this.filterSelectPhotos.bind(this);
        this.isSelectMatchingTag = this.isSelectMatchingTag.bind(this);
        this.updateSearchOptions = this.updateSearchOptions.bind(this);
        this.setAllTags = this.setAllTags.bind(this);
        this.setUniqueTags = this.setUniqueTags.bind(this);
        this.setImageDescriptions = this.setImageDescriptions.bind(this);
        this.openThumbnail = this.openThumbnail.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.imageHover = this.imageHover.bind(this);
        this.imageUnhover = this.imageUnhover.bind(this);
    }

    callAPI() {

        API(this.setImageDescriptions);
            // .then(result => {
            //     // console.log("Result: ",result);
            //     this.setState({photos: result}, function(){DescriptionAPI(this.state.photos, this.setImagesDescription)});
            // })
            // .then(this.setAllTags)
            // // .then(function(test){console.log(test)})
            // .then(uniqueTags => this.setUniqueTags(uniqueTags));
    }

    setImageDescriptions(photos)
    {
        let uniqueTags = this.setAllTags(photos);

        let allSelectOptions = this.setUniqueTags(uniqueTags);
        this.setState({photos, allSelectOptions, currentSelectOptions: allSelectOptions})
    }

    setUniqueTags(uniqueTags)
    {
        let allSelectOptions = uniqueTags.map(
            uniqueTag =>
                {
                    return { value: uniqueTag, label: uniqueTag }
                }
        )
        return allSelectOptions;
        // this.setState({allSelectOptions, currentSelectOptions: allSelectOptions});
    }

    setAllTags(photos) {
        let uniqueTagArray = [];
        photos.map(photoArray =>
            photoArray[3].split(" ").map(photoTag =>
                {
                    if(!uniqueTagArray.includes(photoTag))
                    {
                        uniqueTagArray.push(photoTag);
                    }
                }
            )
        )
        uniqueTagArray.sort();
        return uniqueTagArray;
    }

    closeLightbox () {
        const nextState = {...this.state, currentImage: 0, lightboxIsOpen: false};
        this.setState(nextState);
	}

    filterPhotos() {
        const matchedImages = this.state.photos.filter(this.isMatchingTag);
        //console.log("Matched Images:",matchedImages);
        this.setState({visiblePhotos: matchedImages});
    }

    filterSelectPhotos() {
        const matchedImages = this.state.photos.filter(this.isSelectMatchingTag);
        //console.log(matchedImages);
        const updatedSearchOptions = this.updateSearchOptions();
        const updatedCurrentSearchOptions = this.state.allSelectOptions.filter((tag) => {
            return updatedSearchOptions.includes(tag["value"])
        })
        this.setState({visiblePhotos: matchedImages, currentSelectOptions: updatedCurrentSearchOptions});
    }

    isSelectMatchingTag(image) {
        const tags = image[3].split(" ");
        const selectSearchSplit = this.state.selectSearch.split(",");
        for (let i=0; i<selectSearchSplit.length; i++)
        {
            if (!tags.includes(selectSearchSplit[i]))
            {
                return false
            }
        }
        return true
    }

    updateSearchOptions(){
        let otherSearchOptions = [];
        let searchTags = (() => (this.state.selectSearch === "") ? [] : this.state.selectSearch.split(","))();
        if (searchTags.length === 0)
        {
            otherSearchOptions = this.setAllTags(this.state.photos);
        }
        else
        {
            this.state.photos.map(
                photo => {
                    let tagTest = true;
                    const photoTags = photo[3].split(" ");
                    if(photoTags.length > searchTags.length)
                    {
                        for(let i=0; i<searchTags.length; i++)
                        {
                            if(!photoTags.includes(searchTags[i]))
                            {
                                tagTest = false;
                                break;
                            }
                        }
                        if (tagTest === true)
                        {
                            for(let i=0; i<photoTags.length; i++)
                            {
                                if(!searchTags.includes(photoTags[i]) && !otherSearchOptions.includes(photoTags[i]))
                                {
                                    otherSearchOptions.push(photoTags[i]);
                                }
                            }
                        }
                    }
                }
            )
            otherSearchOptions.push.apply(otherSearchOptions, searchTags)
        }
        return otherSearchOptions;
    }

    getLightboxImages(photos) {
        const images = photos.map(img => {
                const largeImg = img[0].split('.jpg')[0].concat('_b.jpg');
                return ({src: largeImg, caption: img[5]})
        })
        return images;
    }

    gotoPrevious () {
        const nextState = {...this.state, currentImage: this.state.currentImage - 1}
        this.setState(nextState);
	}

	gotoNext () {
        const nextState = {...this.state, currentImage: this.state.currentImage + 1};
        this.setState(nextState);
	}

    handleSelectChange (searchTerm) {
        this.setState({selectSearch: searchTerm}, this.filterSelectPhotos);
        // console.log(this.state.selectSearch)
    }

    handleSearchChange (searchTerm) {
      const photoSet = (this.state.visiblePhotos.length === 0 ? this.state.photos : this.state.visiblePhotos);
      const filterByTerm = searchTerm => (
          photoSet.filter(photo => (
          photo[1].toUpperCase().includes(searchTerm.toUpperCase()) || photo[5].toUpperCase().includes(searchTerm.toUpperCase())
        )))
    this.setState({searchKey: searchTerm, visiblePhotos: (searchTerm === ''? [] : filterByTerm(searchTerm))});
  }

    handleKeyPress(searchTerm) {
        // this.setState({search: searchTerm + this.state.dropdownBottom  + this.state.dropdownTop});
        this.setState({search: searchTerm});
    }

    handleClick(index) {
        const nextState = {...this.state, currentImage: index, lightboxIsOpen: true};
        this.setState(nextState);
    }

    handleClickImage() {
		if (this.state.currentImage === this.getLightboxImages(this.state.visiblePhotos).length - 1) return;
		this.gotoNext();
	}

  openThumbnail(index) {
        const nextState = {...this.state, currentImage: index};
        this.setState(nextState);
    }

    isMatchingTag(image) {
        const tags = image[3].split(" ");
        return tags.includes(this.state.search)
    }

    openLightbox (index, event) {
		event.preventDefault();

        const nextState = {...this.state, currentImage: index, lightboxIsOpen: true};
        this.setState(nextState);
	}

    imageHover(index) {
        var visiblePhotos = this.state.visiblePhotos;
        visiblePhotos[index][6]=true;
        this.setState({visiblePhotos});
    }

    imageUnhover(index) {
        var visiblePhotos = this.state.visiblePhotos;
        visiblePhotos[index][6]=false;
        this.setState({visiblePhotos});
    }

    componentDidMount() {
        this.callAPI();
    }

    searchBarKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearchChange(this.state.searchKey);
    }
  }

    render() {
        const lightboxPhotos = this.getLightboxImages(this.state.visiblePhotos);
        return (
        <div>
          <SearchBar
            onKeyPress={this.searchBarKeyPress}
            onSearchChange={this.handleSearchChange} />
            {/*<DropdownFilter onChange={this.updateSearchTerm} _onSelectTop={this.handleSelectTop} _onSelectBottom={this.handleSelectBottom}/>*/}
            <SelectSearchBar currentSearch={this.state.selectSearch}
                             onSelectChange={this.handleSelectChange}
                             selectOptions={this.state.currentSelectOptions} />
            {/*<SearchBar onChange={this.handleKeyPress} _onButtonClick={this.filterPhotos} _onKeyPress={this.filterPhotos} />*/}
            <Photos _onClick={this.handleClick}
                    images={this.state.visiblePhotos}
                    onMouseHover={this.imageHover}
                    onMouseUnhover={this.imageUnhover} />
            <Lightbox
                currentImage={this.state.currentImage}
                images={lightboxPhotos}
                isOpen={this.state.lightboxIsOpen}
                onClickImage={this.handleClickImage}
                onClickPrev={this.gotoPrevious}
                onClickThumbnail={this.openThumbnail}
                showThumbnails={true}
                onClickNext={this.gotoNext}
                onClose={this.closeLightbox}/>
        </div>
        )
    }
}
