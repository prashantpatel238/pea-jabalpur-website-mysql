
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CustomFieldForm from '@/components/CustomFieldForm.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Search, Edit2, Trash2, ArrowUp, ArrowDown, Settings2, Check, X } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const CustomFieldsManager = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('custom_fields').getFullList({
        sort: 'display_order',
        $autoCancel: false
      });
      setFields(records);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
      toast.error('Failed to load custom fields');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleOpenModal = (field = null) => {
    setEditingField(field);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingField(null);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingField) {
        await pb.collection('custom_fields').update(editingField.id, formData, { $autoCancel: false });
        toast.success('Custom field updated successfully');
      } else {
        await pb.collection('custom_fields').create(formData, { $autoCancel: false });
        toast.success('Custom field created successfully');
      }
      handleCloseModal();
      fetchFields();
    } catch (error) {
      console.error('Error saving custom field:', error);
      toast.error(error.message || 'Failed to save custom field');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!fieldToDelete) return;
    setFormLoading(true);
    try {
      await pb.collection('custom_fields').delete(fieldToDelete.id, { $autoCancel: false });
      toast.success('Custom field deleted successfully');
      setDeleteDialogOpen(false);
      setFieldToDelete(null);
      fetchFields();
    } catch (error) {
      console.error('Error deleting custom field:', error);
      toast.error('Failed to delete custom field');
    } finally {
      setFormLoading(false);
    }
  };

  const handleReorder = async (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) return;

    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap display orders
    const currentOrder = newFields[index].display_order;
    const targetOrder = newFields[targetIndex].display_order;
    
    // If they have the same order, force a difference
    const newCurrentOrder = currentOrder === targetOrder ? (direction === 'up' ? targetOrder - 1 : targetOrder + 1) : targetOrder;
    const newTargetOrder = currentOrder === targetOrder ? currentOrder : currentOrder;

    try {
      // Optimistic update
      const temp = newFields[index];
      newFields[index] = newFields[targetIndex];
      newFields[targetIndex] = temp;
      setFields(newFields);

      await Promise.all([
        pb.collection('custom_fields').update(fields[index].id, { display_order: newCurrentOrder }, { $autoCancel: false }),
        pb.collection('custom_fields').update(fields[targetIndex].id, { display_order: newTargetOrder }, { $autoCancel: false })
      ]);
      
      fetchFields();
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to reorder fields');
      fetchFields(); // Revert on error
    }
  };

  const filteredFields = fields.filter(f => 
    f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.field_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const BooleanIcon = ({ value }) => (
    value ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-muted-foreground/50" />
  );

  return (
    <>
      <Helmet>
        <title>Custom Fields Manager - Admin</title>
      </Helmet>
      <Header />

      <main className="min-h-screen bg-secondary/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center">
                <Settings2 className="w-8 h-8 mr-3 text-primary" />
                Custom Fields
              </h1>
              <p className="text-muted-foreground mt-1">Manage additional profile fields for members</p>
            </div>
            <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Add New Field
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Settings2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Custom Fields</p>
                <p className="text-2xl font-bold text-card-foreground">{fields.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search fields..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : filteredFields.length === 0 ? (
              <div className="p-12 text-center">
                <Settings2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-1">No custom fields found</h3>
                <p className="text-muted-foreground mb-4">Create your first custom field to collect more member data.</p>
                <Button onClick={() => handleOpenModal()} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Add Field
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Order</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-center">Required</TableHead>
                      <TableHead className="text-center">Editable</TableHead>
                      <TableHead className="text-center">Directory</TableHead>
                      <TableHead className="text-center">Private</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <div className="flex flex-col items-center space-y-1">
                            <button 
                              onClick={() => handleReorder(index, 'up')}
                              disabled={index === 0 || searchTerm !== ''}
                              className="text-muted-foreground hover:text-primary disabled:opacity-30"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-medium">{field.display_order}</span>
                            <button 
                              onClick={() => handleReorder(index, 'down')}
                              disabled={index === filteredFields.length - 1 || searchTerm !== ''}
                              className="text-muted-foreground hover:text-primary disabled:opacity-30"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{field.label}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground capitalize">
                            {field.field_type.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell className="text-center"><BooleanIcon value={field.required} /></TableCell>
                        <TableCell className="text-center"><BooleanIcon value={field.member_editable} /></TableCell>
                        <TableCell className="text-center"><BooleanIcon value={field.visible_in_directory} /></TableCell>
                        <TableCell className="text-center"><BooleanIcon value={field.private} /></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenModal(field)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => {
                                setFieldToDelete(field);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingField ? 'Edit Custom Field' : 'Add Custom Field'}</DialogTitle>
          </DialogHeader>
          <CustomFieldForm 
            initialData={editingField} 
            onSubmit={handleSubmit} 
            onCancel={handleCloseModal}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Custom Field?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the field "{fieldToDelete?.label}". 
              Any data members have entered for this field will be orphaned. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={formLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={formLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {formLoading ? 'Deleting...' : 'Delete Field'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CustomFieldsManager;
