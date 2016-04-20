'use strict';

import React from 'react-native';

const {
   View,
   Component,
   StyleSheet,
   TouchableOpacity,
   Animated,
   PropTypes,
   Text
} = React;

class Modal extends Component {
   constructor() {
      super();

      this.state = {
         opacity: new Animated.Value(0),
         scale: new Animated.Value(0.8),
         offset: new Animated.Value(0),
         hidden: true,
      };
   }
   setPhase(toValue) {
      const {animationDuration, animationTension} = this.props;
      this.setState({hidden: false});
      Animated.timing(
         this.state.opacity,
         {
            toValue,
            duration: animationDuration
         }
      ).start();

      Animated.spring(
         this.state.scale,
         {
            toValue: toValue ? 1 : 0.8,
            tension: animationTension
         }
      ).start();

      setTimeout(() => {
         if (toValue) {
            this.props.modalDidOpen();
            this.setState({hidden: false});
         } else {
            this.props.modalDidClose();
            this.setState({hidden: true});
         }
      }, animationDuration);
   }
   render() {
      const {opacity, open, scale, offset, hidden} = this.state;
      const {overlayOpacity} = this.props;
      var stylesArray = [styles.absolute, styles.container]
      if(hidden === true) { stylesArray = styles.hidden; }
      return (
         <View
         pointerEvents={open ? 'auto' : 'none'}
         style={stylesArray}>
            <TouchableOpacity
            style={styles.absolute}
            onPress={this.close.bind(this)}
            activeOpacity={0.75}>
               <Animated.View style={{flex: 1, opacity, backgroundColor: 'rgba(0, 0, 0, ' + overlayOpacity + ')'}} />
            </TouchableOpacity>
            <Animated.View
               style={[
                  styles.defaultModalStyle,
                  this.props.style,
                  {opacity, transform: [{scale}, {translateY: offset}]}
               ]}>
               {this.props.children}
            </Animated.View>
         </View>
      );
   }

   // public methods
   open() {
      this.setState({open: true, hidden: false});
      this.setPhase(1);
   }
   close() {
      this.setState({open: false});
      this.setPhase(0);
   }
   animateOffset(offset) {
      Animated.spring(
         this.state.offset,
         {toValue: offset}
      ).start();
   }
}

Modal.propTypes = {
   overlayOpacity: PropTypes.number,
   animationDuration: PropTypes.number,
   animationTension: PropTypes.number,
   modalDidOpen: PropTypes.func,
   modalDidClose: PropTypes.func
};

Modal.defaultProps = {
   overlayOpacity: 0.75,
   animationDuration: 200,
   animationTension: 40,
   modalDidOpen: () => undefined,
   modalDidClose: () => undefined
};


const styles = StyleSheet.create({
   absolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)'
   },
   container: {
      justifyContent: 'center'
   },
   defaultModalStyle: {
      borderRadius: 2,
      margin: 20,
      padding: 10,
      backgroundColor: '#F5F5F5'
   },
   hidden: {
      position: 'absolute',
      top: -10000,
      left: 0,      
      height: 0,
      width: 0,
   }
});

export default Modal;
