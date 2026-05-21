import { prisma } from './prisma'

export type Role = 'user' | 'editor' | 'moderator' | 'admin'
export type Action = 'read' | 'create' | 'update' | 'delete'
export type Resource =
  | 'traditions'
  | 'teachings'
  | 'misconceptions'
  | 'sacred_texts'
  | 'peace_initiatives'
  | 'similarity_themes'
  | 'shareable_quotes'
  | 'movement_members'
  | 'newsletter_subscribers'
  | 'assessment_results'
  | 'users'
  | 'role_requests'
  | 'core_pillars'
  | 'mission_content'
  | 'wisdom_to_action'
  | 'impact_goals'
  | 'featured_programs'
  | 'regional_initiatives'
  | 'get_involved'
  | 'about_content'
  | 'teaching_sections'
  | 'truth_sections'
  | 'tradition_sections'
  | 'sufi_content'
  | 'approach_content'
  | 'about_values'
  | 'about_leaders'
  | 'sufi_cards'
  | 'approach_cards'
  | 'current_initiatives'
  | 'similarity_teachings'
  | 'page_content'
  | 'founder_sections'
  | 'contact_messages'

/**
 * Check if a user has permission to perform an action on a resource
 */
export async function checkPermission(
  userId: string,
  resource: Resource,
  action: Action
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    })

    if (!user || !user.isActive) {
      return false
    }

    // Admin has all permissions
    if (user.role === 'admin') {
      return true
    }

    // Moderator has all content permissions (not user management)
    if (user.role === 'moderator') {
      const contentResources: Resource[] = [
        'traditions',
        'teachings',
        'misconceptions',
        'sacred_texts',
        'peace_initiatives',
        'similarity_themes',
        'shareable_quotes',
        'movement_members',
        'newsletter_subscribers',
        'assessment_results',
        'core_pillars',
        'mission_content',
        'wisdom_to_action',
        'impact_goals',
        'featured_programs',
        'regional_initiatives',
        'get_involved',
        'teaching_sections',
        'truth_sections',
        'tradition_sections',
        'sufi_content',
        'approach_content',
        'about_values',
        'about_leaders',
        'sufi_cards',
        'approach_cards',
        'current_initiatives',
        'similarity_teachings',
        'contact_messages',
      ]
      return contentResources.includes(resource)
    }

    // Check specific permissions in UserPermission table
    const permission = await prisma.userPermission.findUnique({
      where: {
        userId_resource: {
          userId,
          resource,
        },
      },
    })

    if (permission) {
      return permission.actions.includes(action)
    }

    // Fall back to default permissions for the user's role
    const defaultPermissions = getDefaultPermissions(user.role as Role)
    const defaultForResource = defaultPermissions.find(p => p.resource === resource)
    return defaultForResource?.actions.includes(action) || false
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

/**
 * Check if user has any of the specified roles
 */
export async function hasRole(
  userId: string,
  roles: Role[]
): Promise<boolean> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, isActive: true },
    })

    if (!user || !user.isActive) {
      return false
    }

    return roles.includes(user.role as Role)
  } catch (error) {
    console.error('Error checking role:', error)
    return false
  }
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        permissions: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      role: user.role,
      permissions: user.permissions,
    }
  } catch (error) {
    console.error('Error getting user permissions:', error)
    return null
  }
}

/**
 * Assign permission to a user
 */
export async function assignPermission(
  userId: string,
  resource: Resource,
  actions: Action[]
) {
  try {
    return await prisma.userPermission.upsert({
      where: {
        userId_resource: {
          userId,
          resource,
        },
      },
      create: {
        userId,
        resource,
        actions,
      },
      update: {
        actions,
      },
    })
  } catch (error) {
    console.error('Error assigning permission:', error)
    throw error
  }
}

/**
 * Remove permission from a user
 */
export async function removePermission(userId: string, resource: Resource) {
  try {
    return await prisma.userPermission.delete({
      where: {
        userId_resource: {
          userId,
          resource,
        },
      },
    })
  } catch (error) {
    console.error('Error removing permission:', error)
    throw error
  }
}

/**
 * Get default permissions for a role
 */
export function getDefaultPermissions(role: Role): {
  resource: Resource
  actions: Action[]
}[] {
  switch (role) {
    case 'admin':
      return [] // Admin has all permissions by default

    case 'moderator':
      return [] // Moderator has all content permissions by default

    case 'editor':
      return [
        { resource: 'traditions', actions: ['read', 'create', 'update'] },
        { resource: 'teachings', actions: ['read', 'create', 'update'] },
        { resource: 'sacred_texts', actions: ['read', 'create', 'update'] },
        { resource: 'misconceptions', actions: ['read', 'create', 'update'] },
        { resource: 'peace_initiatives', actions: ['read', 'create', 'update'] },
        { resource: 'similarity_themes', actions: ['read', 'create', 'update'] },
        { resource: 'shareable_quotes', actions: ['read', 'create', 'update'] },
        { resource: 'core_pillars', actions: ['read', 'create', 'update'] },
        { resource: 'mission_content', actions: ['read', 'create', 'update'] },
        { resource: 'wisdom_to_action', actions: ['read', 'create', 'update'] },
        { resource: 'impact_goals', actions: ['read', 'create', 'update'] },
        { resource: 'featured_programs', actions: ['read', 'create', 'update'] },
        { resource: 'regional_initiatives', actions: ['read', 'create', 'update'] },
        { resource: 'get_involved', actions: ['read', 'create', 'update'] },
        { resource: 'teaching_sections', actions: ['read', 'create', 'update'] },
        { resource: 'truth_sections', actions: ['read', 'create', 'update'] },
        { resource: 'tradition_sections', actions: ['read', 'create', 'update'] },
        { resource: 'sufi_content', actions: ['read', 'create', 'update'] },
        { resource: 'approach_content', actions: ['read', 'create', 'update'] },
        { resource: 'about_values', actions: ['read', 'create', 'update'] },
        { resource: 'about_leaders', actions: ['read', 'create', 'update'] },
        { resource: 'sufi_cards', actions: ['read', 'create', 'update'] },
        { resource: 'approach_cards', actions: ['read', 'create', 'update'] },
        { resource: 'current_initiatives', actions: ['read', 'create', 'update'] },
        { resource: 'similarity_teachings', actions: ['read', 'create', 'update'] },
        { resource: 'page_content', actions: ['read', 'create', 'update'] },
        { resource: 'founder_sections', actions: ['read', 'create', 'update'] },
        { resource: 'contact_messages', actions: ['read', 'create', 'update'] },
      ]

    case 'user':
    default:
      return []
  }
}
