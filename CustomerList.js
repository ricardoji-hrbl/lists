import React, {useRef, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import faker from 'faker';

const data = new Array(100)
  .fill(0)
  .map(() => ({
    id: faker.datatype.uuid(),
    name: `${faker.name.findName()} ${faker.name.lastName()}`,
  }))
  .sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (a.name < b.name) {
      return -1;
    }
    // a must be equal to b
    return 0;
  });

const categories = [
  ...new Set(data.map(item => item.name.charAt(0).toUpperCase())),
];

const listData = categories.reduce((acc, curr) => {
  acc.push({
    title: curr,
    data: data.filter(el => el.name.charAt(0) === curr),
  });
  return acc;
}, []);

const ALPHABET = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
];

const CustomerList = () => {
  const usersListRef = useRef(null);
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

  const isLetterAvailable = letter =>
    categories.some(el => el === letter.toUpperCase());

  const getLetterStyle = letter =>
    isLetterAvailable(letter) ? styles.enabledLetter : styles.disabledLetter;

  const getCategoryIndex = letter => categories.indexOf(letter.toUpperCase());

  const goToSection = sectionIndex => {
    usersListRef.current?.scrollToLocation({
      sectionIndex,
      itemIndex: 0,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        ref={usersListRef}
        sections={listData}
        initialNumToRender={20}
        keyExtractor={(item, index) => item + index}
        renderItem={renderProductItem}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
      />
      <View style={styles.letters}>
        {ALPHABET.map(letter => (
          <TouchableOpacity
            onPress={() => goToSection(getCategoryIndex(letter))}
            key={letter}
            disabled={!isLetterAvailable(letter)}>
            <View>
              <Text style={getLetterStyle(letter)}>{letter.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    flexDirection: 'row',
  },
  enabledLetter: {
    fontWeight: 'bold',
  },
  disabledLetter: {
    color: '#ccc',
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
  letters: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
    width: 20,
  },
});

export default CustomerList;
