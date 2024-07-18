import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl, SelectControl, RangeControl } from '@wordpress/components';
import { createHigherOrderComponent } from '@wordpress/compose';
import { useState, useEffect } from '@wordpress/element';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import lodash from 'lodash';

const allowedBlocks = [ 'core/group', 'core/column' ];

import 'animate.css';
import '../sass/_style.scss';

const getAnimationNames = () => {
	const animationNames = [];

	[...document.styleSheets].forEach( ( styleSheet ) => {
		if ( styleSheet.ownerNode && styleSheet?.ownerNode?.id && styleSheet.ownerNode.id === 'animation-filters-css' ) {
			if ( styleSheet.cssRules ) {
				[...styleSheet.cssRules].forEach( ( rule ) => {
					if( rule.cssText.includes( '@keyframes' ) ) {
						animationNames.push( rule.name );
					}
				} );
			}
		}
	});
	return animationNames;
};

const extraAttributes = ( settings ) => {
	const { attributes, name } = settings;

	if ( ! allowedBlocks.includes( name ) ) {
		return settings;
	}

	return {
		...settings,
		attributes: {
			...attributes,
			hasAnimation: {
				default: false,
				type: 'boolean',
			},
			animationType: {
				default: 'slide-in',
				type: 'string',
			},
			animationTiming: {
				default: 'ease-in-out',
				type: 'string',
			},
			animationDuration: {
				default: 0.75,
				type: 'number',
			},
			animationDelay: {
				default: 0,
				type: 'number',
			},
			previewAnimation: {
				default: false,
				type: 'boolean',
			}
		},
	};
};

const withInspectorControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
	   const {
		   attributes: {
			   hasAnimation,
			   animationType,
			   animationDuration,
			   animationDelay,
			   animationTiming,
			   previewAnimation
		   },
		   setAttributes,
		   name,
	   } = props;

	   if ( ! allowedBlocks.includes( name ) ) {
		   return <BlockEdit { ...props } />;
	   }

	   useEffect( () => {
		   setAnimationNames( getAnimationNames() );
	   }, [] );

	   const [ animationNames, setAnimationNames ] = useState( [] );

	   return (
		   <Fragment>
			   <BlockEdit { ...props } />
			   <InspectorControls>
				   <PanelBody
					   title={ __( 'Animation Settings', 'animation-filters' ) }
					   initialOpen={ false }
				   >
					   <ToggleControl
						   label={ __( 'Add Animation Class', 'animation-filters' ) }
						   checked={ hasAnimation }
						   onChange={ ( hasAnimation ) => setAttributes( { hasAnimation } ) }
						   help={ __( 'Add animation class to this block.', 'animation-filters' ) }
					   />
					   {
						   hasAnimation && (

							   <Fragment>
								   <SelectControl
									   label={ __( 'Animation Type', 'animation-filters' ) }
									   value={ animationType }
									   options={ 
											animationNames.map( ( animationName ) => ( { label: animationName, value: animationName } ) )
									   	}
									   onChange={ ( animationType ) => setAttributes( { animationType } ) }
								   />
								   <SelectControl
									   label={ __( 'Animation Timing', 'animation-filters' ) }
									   value={ animationTiming }
									   options={ [
										{ label: __( 'Ease', 'animation-filters' ), value: 'ease' },
										{ label: __('Ease In', 'animation-filters' ), value: 'ease-in' },
										{ label: __('Ease out', 'animation-filters' ), value:'ease-out'},
										{ label: __('Ease in out', 'animation-filters' ), value: 'ease-in-out'},
										{ label: __('linear', 'animation-filters' ), value: 'linear'},
										{ label: __('Step Start', 'animation-filters' ), value: 'step-start'},
										{ label: __('Step End', 'animation-filters' ), value: 'step-end'},
									   ] }
									   onChange={ ( animationTiming ) => setAttributes( { animationTiming } ) }
								   />

								   <RangeControl
									   label={ __( 'Animation Duration', 'animation-filters' ) }
									   value={ animationDuration }
									   onChange={ ( animationDuration ) => setAttributes( { animationDuration: Number( animationDuration ) } ) }
									   step={ 0.25 }
									   min={ 0.5 }
									   max={ 10 }
								   />
								   <RangeControl
									   label={ __( 'Animation Delay', 'animation-filters' ) }
									   value={ animationDelay }
									   onChange={ ( animationDelay ) => setAttributes( { animationDelay: Number( animationDelay ) } ) }
									   step={ 0.25 }
									   min={ 0 }
									   max={ 10 }
								   />
								   <Button
								   	onClick={ () => setAttributes( { previewAnimation: true } ) }
									variant="primary"
									disabled={ previewAnimation }
									>
									   { __( 'Preview Animation', 'animation-filters' ) }
								   </Button>
							   </Fragment>
						   )
					   }
				   </PanelBody>
			   </InspectorControls>
		   </Fragment>
	   );
   };
}, 'withInspectorControls' );

const toggleAnimationBE = createHigherOrderComponent( ( BlockListBlock ) => {
	
	return ( props ) => {
		const { attributes, name, setAttributes } = props;
		const { previewAnimation, animationType, animationTiming, animationDuration, animationDelay } = attributes;

		if ( ! allowedBlocks.includes( name ) ) {
			return <BlockListBlock { ...props } />;
		}

		setTimeout(() => {
			setAttributes({ previewAnimation: false });
		}, ( animationDelay + animationDuration ) * 1000);

		return <BlockListBlock
				{ ...props }
				className={ previewAnimation ? 'do-animation animate' : '' }
				wrapperProps={{
					style: {
						'--animation-name': animationType,
						'--animation-timing': animationTiming,
						'--animation-duration': `${ animationDuration }s`,
						'--animation-delay': `${ animationDelay }s`,
					}
				}}
			/>;
	};
}, 'toggleAnimationBE' );



function applyExtraClasses( extraProps, blockType, attributes ) {
	if ( ! allowedBlocks.includes( blockType.name ) ) {
		return extraProps;
	}

	const { hasAnimation } = attributes;

	if ( ! hasAnimation ) {
		return extraProps;
	}

   return lodash.assign( 
	   extraProps, 
	   { 
		   className: `${ extraProps?.className } animate`,
		   style: {
			   '--animation-name': attributes.animationType,
			   '--animation-timing': attributes.animationTiming,
			   '--animation-duration': `${ attributes.animationDuration }s`,
			   '--animation-delay': `${ attributes.animationDelay }s`,
		   }
	   } 
   );
}

addFilter(
    'blocks.registerBlockType',
    'blazepro-blocks/block-animation-attributes',
    extraAttributes
);

addFilter(
    'editor.BlockEdit',
    'blazepro-blocks/block-animation-inspector',
    withInspectorControls,
);

addFilter(
    'editor.BlockListBlock',
    'blazepro-blocks/toogle-animation-be',
    toggleAnimationBE
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'blazepro-blocks/block-animation-save',
	applyExtraClasses
);