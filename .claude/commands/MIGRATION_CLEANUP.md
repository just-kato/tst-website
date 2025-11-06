# Post-Migration Cleanup Tasks

## Files to Remove (After Full Migration)

1. **Legacy GraphQL File**
   - `src/lib/graphql/queries.ts` - Contains deprecation notice, can be removed once all components are migrated

## Files to Update

1. **Component Files**
   - Search for any remaining imports from the old `queries.ts` file
   - Update to use new modular structure or custom hooks

## Commands to Run

```bash
# Search for remaining legacy imports
grep -r "from '@/lib/graphql/queries'" src/ --exclude-dir=node_modules

# Search for direct Apollo Client usage
grep -r "apolloClient.mutate\|apolloClient.query" src/ --exclude-dir=node_modules

# Remove test files (optional)
rm test_security.sql
```

## Verification Steps

1. **Build Test**
   ```bash
   npm run build
   ```

2. **GraphQL Functionality Test**
   ```bash
   curl -X POST http://localhost:3000/api/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "query { contacts { id name email } }"}'
   ```

3. **Security Test**
   - Verify all views require authentication
   - Check audit logs are being created
   - Confirm RLS policies are active

## Success Criteria

- ✅ All components use new GraphQL structure
- ✅ No remaining imports from deprecated files
- ✅ All security policies working correctly
- ✅ Build passes without errors
- ✅ All functionality tested and working