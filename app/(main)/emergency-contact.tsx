import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: 'বাবা', phone: '01711000000' },
  { id: '2', name: 'ভাই', phone: '01811000000' }
];

export default function EmergencyContactScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleBack = () => {
    router.back();
  };

  const handleAddContact = () => {
    if (newName.trim() && newPhone.trim()) {
      const newContact = {
        id: Date.now().toString(),
        name: newName,
        phone: newPhone
      };
      setContacts([...contacts, newContact]);
      setNewName('');
      setNewPhone('');
      setIsAdding(false);
    }
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <View style={styles.contactCard}>
      <View style={styles.contactAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>
      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveContact(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>জরুরি যোগাযোগ</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          বিপদের সময় আপনার রাইড শেয়ার করতে এবং দ্রুত যোগাযোগ করতে নিচে আপনার বিশ্বস্ত নম্বরগুলো যোগ করুন।
        </Text>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {isAdding ? (
          <View style={styles.addForm}>
            <TextInput
              style={styles.input}
              placeholder="নাম"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="ফোন নম্বর"
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
            />
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsAdding(false)}>
                <Text style={styles.cancelButtonText}>বাতিল</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddContact}>
                <Text style={styles.saveButtonText}>সংরক্ষণ করুন</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.addButton} onPress={() => setIsAdding(true)}>
            <Ionicons name="add-circle-outline" size={24} color={colors.surface} />
            <Text style={styles.addButtonText}>নতুন নম্বর যোগ করুন</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
  },
  headerRight: {
    width: 36,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 20,
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '20', // light primary
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    color: colors.primary,
    fontWeight: 'bold',
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: typography.fontFamilyBn,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 'auto',
  },
  addButtonText: {
    color: colors.surface,
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
    marginLeft: 8,
  },
  addForm: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 'auto',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontFamily: typography.fontFamilyBn,
    fontSize: typography.sizes.md,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontFamily: typography.fontFamilyBn,
  },
});
