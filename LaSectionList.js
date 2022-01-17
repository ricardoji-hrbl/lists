import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  SectionList,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import faker from 'faker';

const categories = new Array(10)
  .fill(0)
  .map(() => ({id: faker.datatype.uuid(), name: faker.company.companyName()}));

const sectionData = categories.reduce((acc, category, index) => {
  const names = new Array(100).fill(0).map(() => ({
    id: faker.datatype.uuid(),
    name: `${faker.name.findName()} ${faker.name.lastName()}`,
  }));
  acc.push({index, title: category.name, data: names});
  return acc;
}, []);

const VIEWABLE_CONFIG = {itemVisiblePercentThreshold: 80};

const LaSectionList = () => {
  const ref = useRef(null);
  const ref2 = useRef(null);
  const [disableScroll, setDisableScroll] = useState(false);
  const handleViewableItemsChangedRef = useRef(({viewableItems}) => {
    // setCurrentCategoryIndex(prev =>
    //   viewableItems[0]?.index ? viewableItems[0].index : prev,
    // );
    // setCurrentIndex(prev =>
    //   viewableItems[0]?.index ? viewableItems[0]?.index : prev,
    // );
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const renderItem = useCallback(
    ({item, index}) => (
      <TouchableOpacity onPress={() => onPressCategory(index)}>
        <View
          style={index === currentIndex ? styles.itemSelected : styles.item}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    ),
    [currentIndex],
  );

  const renderProductItem = useCallback(
    ({item, index}) => (
      <View style={styles.productItem}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: 'https://reactnative.dev/img/tiny_logo.png',
          }}
        />
        <Text style={styles.title}>{item.name}</Text>
      </View>
    ),
    [],
  );

  useEffect(() => {
    if (!disableScroll) {
      ref.current?.scrollToIndex({index: currentSection, viewPosition: 0.5});
      setCurrentIndex(prev =>
        prev !== currentSection ? currentSection : prev,
      );
    }
  }, [currentSection, disableScroll]);

  const onPressCategory = ind => {
    setDisableScroll(true);
    setCurrentIndex(ind);
    ref.current?.scrollToIndex({index: ind, viewPosition: 0.5});
    ref2.current?.scrollToLocation({
      sectionIndex: ind,
      itemIndex: 0,
    });
  };

  const onScrollEndCategories = ({nativeEvent}) => {
    if (nativeEvent.velocity && nativeEvent.velocity.x === 0) {
      //setCurrentIndex(currentCategoryIndex);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topMenu}>
        <FlatList
          ref={ref}
          data={categories}
          renderItem={renderItem}
          initialNumToRender={2}
          initialScrollIndex={currentIndex}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScrollEndDrag={onScrollEndCategories}
          onMomentumScrollEnd={onScrollEndCategories}
          viewabilityConfig={VIEWABLE_CONFIG}
          onViewableItemsChanged={handleViewableItemsChangedRef.current}
        />
      </View>
      <View style={styles.listContainer}>
        <SectionList
          ref={ref2}
          sections={sectionData}
          initialNumToRender={20}
          keyExtractor={(item, index) => item + index}
          renderItem={renderProductItem}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          onViewableItemsChanged={({viewableItems}) => {
            if (viewableItems.length > 1) {
              const {index} = viewableItems[0].section;
              setCurrentSection(prev => (prev !== index ? index : prev));
            }
          }}
          getItemLayout={sectionListGetItemLayout({
            // The height of the row with rowData at the given sectionIndex and rowIndex
            getItemHeight: (rowData, sectionIndex, rowIndex) => 40,
            // These four properties are optional
            getSectionHeaderHeight: () => 40,
          })}
          onMomentumScrollEnd={() => setDisableScroll(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  topMenu: {},
  listContainer: {
    flexGrow: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 10,
  },
  itemSelected: {
    backgroundColor: 'green',
    padding: 10,
  },
  productItem: {
    height: 40,
    flexDirection: 'row',
  },
  separator: {
    width: 10,
  },
  header: {
    height: 40,
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
});

export default LaSectionList;
